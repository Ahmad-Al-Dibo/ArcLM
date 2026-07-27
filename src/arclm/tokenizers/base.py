"""Tokenizers die tekst omzetten naar token ids en terug."""

import tempfile
from collections import Counter
from pathlib import Path
import base64
import json
import sentencepiece as spm


class Tokenizer:
    """Zet tekst om naar woord-tokens en token ids.

    Deze tokenizer splitst tekst op whitespace. Dat maakt hem simpel
    en makkelijk te volgen voor kleine trainingen en tests.
    """
    
    def __init__(self, max_vocab=50000, default_token="<UNK>", user_defined_symbols=None):
        """Maakt een nieuwe woord-tokenizer."""
        self.max_vocab = max_vocab
        self.default_token = default_token
        self.user_defined_symbols = list(user_defined_symbols or [])
        self.vocab = None
        self.stoi = None  # van token naar index
        self.itos = None  # van index naar token
        self.vocab_size = 0
        self.token_counts = Counter()
    
    def build(self, text):
        """Bouwt de vocabulaire op basis van tekst."""
        tokens = text.split()
        token_counts = Counter(tokens)
        self.token_counts = token_counts
        
        reserved = []
        for token in self.user_defined_symbols:
            if token and token != self.default_token and token not in reserved:
                reserved.append(token)

        remaining_vocab = max(self.max_vocab - 1 - len(reserved), 0)
        most_common = [
            token
            for token, _ in token_counts.most_common()
            if token != self.default_token and token not in reserved
        ][:remaining_vocab]
        self.vocab = [self.default_token] + reserved[: max(self.max_vocab - 1, 0)] + most_common
        
        self.stoi = {word: i for i, word in enumerate(self.vocab)}
        self.itos = {i: word for word, i in self.stoi.items()}
        self.vocab_size = len(self.vocab)
    
    def encode(self, tokens):
        """Zet tokens om naar token ids."""
        if self.stoi is None:
            raise ValueError("Tokenizer not built. Call build() first.")
        
        unk_idx = self.stoi.get(self.default_token, 0)
        return [self.stoi.get(token, unk_idx) for token in tokens if token]

    def encode_text(self, text):
        """Zet ruwe tekst om naar token ids."""
        return self.encode(text.split())
    
    def decode(self, indices):
        """Zet token ids terug naar tokens."""
        if self.itos is None:
            raise ValueError("Tokenizer not built. Call build() first.")
        
        return [self.itos[idx] for idx in indices if idx in self.itos]
    
    def decode_string(self, indices):
        """Zet token ids terug naar een tekststring."""
        return " ".join(self.decode(indices))
    
    def get_vocab_size(self):
        """Geeft het aantal tokens in de vocabulaire terug."""
        return self.vocab_size

    def get_unknown_index(self):
        """Geeft de index terug die voor onbekende tokens wordt gebruikt."""
        if self.stoi is None:
            raise ValueError("Tokenizer not built. Call build() first.")
        return self.stoi.get(self.default_token, 0)

    def get_rare_tokens(self, min_count=2, limit=20):
        """Geeft tokens terug die weinig voorkwamen tijdens het bouwen."""
        if not self.token_counts:
            return []

        rare_tokens = [
            (token, count)
            for token, count in self.token_counts.items()
            if count < min_count
        ]
        rare_tokens.sort(key=lambda item: (item[1], item[0]))
        return rare_tokens[:limit]

    def analyze_coverage(self, tokens, rare_threshold=2, top_unknown=20):
        """Meet hoeveel tokens bekend, onbekend of zeldzaam zijn."""
        if self.stoi is None:
            raise ValueError("Tokenizer not built. Call build() first.")

        clean_tokens = [token for token in tokens if token]
        total_tokens = len(clean_tokens)
        unknown_counter = Counter(token for token in clean_tokens if token not in self.stoi)
        unknown_tokens = sum(unknown_counter.values())
        unique_tokens = set(clean_tokens)
        known_unique = {token for token in unique_tokens if token in self.stoi}
        rare_tokens = self.get_rare_tokens(min_count=rare_threshold, limit=top_unknown)

        return {
            "total_tokens": total_tokens,
            "known_tokens": total_tokens - unknown_tokens,
            "unknown_tokens": unknown_tokens,
            "unknown_rate": unknown_tokens / total_tokens if total_tokens else 0.0,
            "unique_tokens": len(unique_tokens),
            "known_unique_tokens": len(known_unique),
            "unknown_unique_tokens": len(unique_tokens) - len(known_unique),
            "vocab_size": self.vocab_size,
            "vocab_coverage": len(known_unique) / len(unique_tokens) if unique_tokens else 0.0,
            "rare_threshold": rare_threshold,
            "rare_training_tokens": rare_tokens,
            "top_unknown_tokens": unknown_counter.most_common(top_unknown),
        }
    
    def save_vocab(self, path):
        """Slaat de vocabulaire op als tekstbestand."""
        with open(path, "w", encoding="utf-8") as f:
            for token in self.vocab:
                f.write(token + "\n")
    
    def load_vocab(self, path):
        """Laadt de vocabulaire uit een tekstbestand."""
        with open(path, "r", encoding="utf-8") as f:
            self.vocab = [line.strip() for line in f.readlines()]
        
        self.stoi = {word: i for i, word in enumerate(self.vocab)}
        self.itos = {i: word for word, i in self.stoi.items()}
        self.vocab_size = len(self.vocab)
        self.token_counts = Counter()

    def to_checkpoint(self):
        """Geeft metadata terug die in een checkpoint kan worden opgeslagen."""
        return {
            "tokenizer_type": "word",
            "max_vocab": self.max_vocab,
            "user_defined_symbols": self.user_defined_symbols,
        }

    def to_json(self):
        """Zet de tokenizer om naar een JSON-vriendelijke dict."""
        return {
            "tokenizer_type": "word",
            "max_vocab": self.max_vocab,
            "user_defined_symbols": self.user_defined_symbols,
            "vocab_size": self.vocab_size,
            "vocab": self.vocab,
            "token_counts": dict(self.token_counts),
        }
    
    def save(self, path):
        """Slaat de tokenizer op als JSON-bestand."""
        metadata = self.to_json()
        with open(path, "w", encoding="utf-8") as f:
            json.dump(metadata, f, indent=4)
        
        return {
            "vocab_size": self.vocab_size,
            "vocab": self.vocab,
            "stoi": self.stoi,
            "itos": self.itos
        }

    @classmethod
    def from_json(cls, data):
        """Maakt een woord-tokenizer vanuit een JSON-vriendelijke dict."""
        tokenizer = cls(
            max_vocab=data["max_vocab"],
            user_defined_symbols=data.get("user_defined_symbols"),
        )

        tokenizer.vocab = data["vocab"]
        tokenizer.vocab_size = data["vocab_size"]

        tokenizer.stoi = {
            token: idx
            for idx, token in enumerate(tokenizer.vocab)
        }

        tokenizer.itos = {
            idx: token
            for idx, token in enumerate(tokenizer.vocab)
        }

        tokenizer.token_counts = Counter(
            data.get("token_counts", {})
        )

        return tokenizer


class SentencePieceTokenizer:
    """SentencePiece tokenizer voor subword taalmodeltraining."""

    def __init__(self, max_vocab=50000, model_type="bpe", character_coverage=1.0, default_token="<UNK>", model_name=None, user_defined_symbols=None,):
        """Maakt een SentencePiece tokenizer met de gekozen instellingen."""
        self.max_vocab = max_vocab
        self.model_type = model_type
        self.model_name = model_name
        self.character_coverage = character_coverage
        self.default_token = default_token
        self.processor = spm.SentencePieceProcessor()
        self.vocab = None
        self.stoi = None
        self.itos = None
        self.vocab_size = 0
        self.token_counts = Counter()
        self.user_defined_symbols=[
        "<|qa_start|>",
        "<|res_start|>",
        "<|end|>",
        "<|pad|>",
    ] if user_defined_symbols is None else user_defined_symbols

    def _format_training_text(self, text, max_line_length=4000):
        """Breekt lange regels op zodat SentencePiece ze niet overslaat."""
        lines = []
        for raw_line in text.splitlines() or [text]:
            words = raw_line.split()
            if not words:
                continue

            current = []
            current_length = 0
            for word in words:
                extra = len(word) + (1 if current else 0)
                if current and current_length + extra > max_line_length:
                    lines.append(" ".join(current))
                    current = [word]
                    current_length = len(word)
                else:
                    current.append(word)
                    current_length += extra

            if current:
                lines.append(" ".join(current))

        return "\n".join(lines)

    def build(self, text:str) -> dict:
        """Traint een SentencePiece tokenizer op ruwe tekst.

        Args:
            text: De tekst waarop de tokenizer wordt getraind.

        Returns:
            Een dict met vocabulaire en index-mappings.
        """
        self.token_counts = Counter(text.split())

        with tempfile.TemporaryDirectory() as tmpdir:
            tmpdir_path = Path(tmpdir)
            input_path = tmpdir_path / "sentencepiece_input.txt"
            model_prefix = tmpdir_path / "sentencepiece_tokenizer"
            input_path.write_text(self._format_training_text(text), encoding="utf-8")

            user_defined_symbols = [
                token
                for token in self.user_defined_symbols
                if token and token != "<|pad|>"
            ]

            spm.SentencePieceTrainer.train(
                input=str(input_path),
                model_prefix=str(model_prefix),
                vocab_size=self.max_vocab,
                model_type=self.model_type,
                character_coverage=self.character_coverage,
                user_defined_symbols=user_defined_symbols,
                hard_vocab_limit=False,
                unk_id=0,
                bos_id=-1,
                eos_id=-1,
                pad_id=1,
                pad_piece="<|pad|>",
            )
            self.processor.load(str(model_prefix) + ".model")

        return self._refresh_vocab()

    def to_checkpoint(self):
        """Geeft metadata terug die in een checkpoint kan worden opgeslagen."""
        return {
            "tokenizer_type": "sentencepiece",
            "max_vocab": self.max_vocab,
            "model_type": self.model_type,
            "character_coverage": self.character_coverage,
            "user_defined_symbols": self.user_defined_symbols,
            "model_proto": self.processor.serialized_model_proto(),
        }

    @classmethod
    def from_checkpoint(cls, metadata):
        """Maakt een SentencePiece tokenizer vanuit checkpoint metadata."""
        tokenizer = cls(
            max_vocab=metadata.get("max_vocab", 50000),
            model_type=metadata.get("model_type", "bpe"),
            character_coverage=metadata.get("character_coverage", 1.0),
            user_defined_symbols=metadata.get("user_defined_symbols"),
        )
        model_proto = metadata.get("model_proto")
        if not model_proto:
            raise ValueError("SentencePiece tokenizer metadata is missing model_proto.")
        tokenizer.processor.load_from_serialized_proto(model_proto)
        tokenizer._refresh_vocab()
        return tokenizer

    def _refresh_vocab(self):
        """Leest de vocabulaire opnieuw uit de SentencePiece processor."""
        self.vocab_size = self.processor.get_piece_size()
        self.vocab = [self.processor.id_to_piece(idx) for idx in range(self.vocab_size)]
        self.stoi = {piece: idx for idx, piece in enumerate(self.vocab)}
        self.itos = {idx: piece for idx, piece in enumerate(self.vocab)}
        return {
            "vocab_size": self.vocab_size,
            "vocab": self.vocab,
            "stoi": self.stoi,
            "itos": self.itos
        }

    def encode(self, tokens):
        """Zet tokens om naar ids door ze eerst weer tekst te maken."""
        return self.encode_text(" ".join(token for token in tokens if token))

    def encode_text(self, text, out_type=int):
        """Zet ruwe tekst om naar SentencePiece token ids."""
        return self.processor.encode(text, out_type=out_type)

    def decode(self, indices):
        """Zet token ids terug naar SentencePiece stukjes."""
        return [self.itos[idx] for idx in indices if idx in self.itos]

    def decode_string(self, indices):
        """Zet token ids direct terug naar tekst."""
        return self.processor.decode([int(idx) for idx in indices])

    def get_vocab_size(self):
        """Geeft het aantal tokens in de vocabulaire terug."""
        return self.vocab_size

    def get_unknown_index(self):
        """Geeft de index terug voor onbekende SentencePiece stukjes."""
        return self.processor.unk_id()

    def get_rare_tokens(self, min_count=2, limit=20):
        """Geeft zeldzame whitespace-tokens uit de trainingstekst terug."""
        rare_tokens = [
            (token, count)
            for token, count in self.token_counts.items()
            if count < min_count
        ]
        rare_tokens.sort(key=lambda item: (item[1], item[0]))
        return rare_tokens[:limit]
    

    def to_json(self):
        """Zet de SentencePiece tokenizer om naar een JSON-vriendelijke dict."""
        return {
            "tokenizer_type": "sentencepiece",
            "model_name": self.model_name,
            "max_vocab": self.max_vocab,
            "model_type": self.model_type,
            "character_coverage": self.character_coverage,
            "user_defined_symbols": self.user_defined_symbols,
            "vocab_size": self.vocab_size,
            "model_proto": base64.b64encode(
                self.processor.serialized_model_proto()
            ).decode("utf-8"),
            "token_counts": dict(self.token_counts),
        }

    def save(self, path):
        """Slaat de SentencePiece tokenizer op als JSON-bestand."""
        metadata = self.to_json()
        with open(path, "w", encoding="utf-8") as f:
            json.dump(metadata, f, indent=4)
        
        return {
            "vocab_size": self.vocab_size,
            "vocab": self.vocab,
            "stoi": self.stoi,
            "itos": self.itos
        }

    @classmethod
    def from_json(cls, data):
        """Maakt een SentencePiece tokenizer vanuit een JSON-vriendelijke dict."""
        tokenizer = cls(
            max_vocab=data["max_vocab"],
            model_type=data["model_type"],
            character_coverage=data["character_coverage"],
            model_name=data.get("model_name"),
            user_defined_symbols=data.get("user_defined_symbols"),
        )
        model_proto = base64.b64decode(data["model_proto"])
        tokenizer.processor.load_from_serialized_proto(model_proto)
        tokenizer.token_counts = Counter(data.get("token_counts", {}))
        tokenizer._refresh_vocab()
        return tokenizer

    @classmethod
    def load(cls, path):
        """Laadt een SentencePiece tokenizer uit een JSON-bestand."""

        with open(path, "r") as f:
            data = json.load(f)

        tokenizer = cls(
            max_vocab=data["max_vocab"],
            model_type=data["model_type"],
            character_coverage=data["character_coverage"],
            user_defined_symbols=data.get("user_defined_symbols"),
        )
        model_proto = base64.b64decode(
            data["model_proto"]
        )
        tokenizer.processor.load_from_serialized_proto(
            model_proto
        )
        tokenizer.token_counts = Counter(
            data.get("token_counts", {})
        )
        tokenizer._refresh_vocab()
        return tokenizer

    def analyze_coverage(self, tokens, rare_threshold=2, top_unknown=20):
        """Meet hoeveel SentencePiece stukjes bekend of onbekend zijn."""
        text = " ".join(token for token in tokens if token)
        pieces = self.processor.encode(text, out_type=str)
        ids = self.processor.encode(text, out_type=int)
        unk_id = self.get_unknown_index()
        unknown_pieces = [piece for piece, idx in zip(pieces, ids) if idx == unk_id]
        unknown_counter = Counter(unknown_pieces)
        total_pieces = len(ids)

        return {
            "total_tokens": total_pieces,
            "known_tokens": total_pieces - len(unknown_pieces),
            "unknown_tokens": len(unknown_pieces),
            "unknown_rate": len(unknown_pieces) / total_pieces if total_pieces else 0.0,
            "unique_tokens": len(set(pieces)),
            "known_unique_tokens": len(set(pieces) - set(unknown_pieces)),
            "unknown_unique_tokens": len(set(unknown_pieces)),
            "vocab_size": self.vocab_size,
            "vocab_coverage": 1.0 - (
                len(set(unknown_pieces)) / len(set(pieces)) if pieces else 0.0
            ),
            "rare_threshold": rare_threshold,
            "rare_training_tokens": self.get_rare_tokens(
                min_count=rare_threshold,
                limit=top_unknown,
            ),
            "top_unknown_tokens": unknown_counter.most_common(top_unknown),
        }

    def get_meta_data(self):
        """Geeft korte metadata over de tokenizer terug."""
        return {
            "tokenizer_type": "sentencepiece",
            "max_vocab": self.max_vocab,
            "model_type": self.model_type,
            "character_coverage": self.character_coverage,
            "user_defined_symbols": self.user_defined_symbols,
            "vocab_size": self.vocab_size,
        }


# ============================================================================
# TOKENIZER FACTORY: kiest tussen de beschikbare tokenizers
# ============================================================================

class TokenizerFactory:
    """Kiest en maakt tokenizer classes op basis van een korte naam."""

    _registry = {}

    @classmethod
    def register(cls, tokenizer_type, tokenizer_class):
        """Registreert een tokenizer class onder een type-naam."""
        cls._registry[tokenizer_type.lower().strip()] = tokenizer_class

    @classmethod
    def create(cls, tokenizer_type="word", **kwargs):
        """Maakt een tokenizer op basis van de geregistreerde type-naam."""
        tokenizer_type = tokenizer_type.lower().strip()
        if tokenizer_type not in cls._registry:
            supported = "', '".join(sorted(cls._registry))
            raise ValueError(
                f"Unknown tokenizer type: {tokenizer_type}. "
                f"Supported: '{supported}'"
            )
        return cls._registry[tokenizer_type](**kwargs)

    @classmethod
    def from_config(cls, config):
        """Maakt een tokenizer vanuit een config-achtig object."""
        tokenizer_type = getattr(config, 'tokenizer_type', 'word')
        max_vocab = getattr(config, 'vocab_size', None) or getattr(config, 'max_vocab', 50000)

        if tokenizer_type == "sentencepiece":
            model_type = getattr(config, 'sentencepiece_model_type', 'bpe')
            character_coverage = getattr(config, 'sentencepiece_character_coverage', 1.0)
            return cls.create(
                "sentencepiece",
                max_vocab=max_vocab,
                model_type=model_type,
                character_coverage=character_coverage,
                user_defined_symbols=getattr(config, "user_defined_symbols", None),
            )

        return cls.create(
            "word",
            max_vocab=max_vocab,
            user_defined_symbols=getattr(config, "user_defined_symbols", None),
        )


TokenizerFactory.register("word", Tokenizer)
TokenizerFactory.register("sentencepiece", SentencePieceTokenizer)

def create_tokenizer(tokenizer_type="word", **kwargs):
    """Maakt een tokenizer met een korte type-naam.
    
    Args:
        tokenizer_type: `"word"` of `"sentencepiece"`.
        **kwargs: Extra opties voor de tokenizer constructor.
        
    Returns:
        Een `Tokenizer` of `SentencePieceTokenizer`.
        
    Examples:
        >>> tok = create_tokenizer("word", max_vocab=10000)
        >>> tok = create_tokenizer("sentencepiece", model_type="bpe")
    """
    return TokenizerFactory.create(tokenizer_type, **kwargs)


def get_tokenizer_from_config(config):
    """Maakt een tokenizer vanuit een config object.
    
    Args:
        config: Config object met tokenizer-instellingen.
        
    Returns:
        Een tokenizer die klaar is om te bouwen of te gebruiken.
    """
    return TokenizerFactory.from_config(config)


