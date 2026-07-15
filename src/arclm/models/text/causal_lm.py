"""Modelarchitectuur voor het compacte ArcLM taalmodel."""

import math
import torch
import torch.nn as nn


class SelfAttention(nn.Module):
    """Self-attention laag die tokens naar eerdere tokens laat kijken."""
    
    def __init__(self, embed_dim, dropout=0.0):
        """Maakt de query, key en value lagen voor attention."""
        super().__init__()
        self.query = nn.Linear(embed_dim, embed_dim)
        self.key = nn.Linear(embed_dim, embed_dim)
        self.value = nn.Linear(embed_dim, embed_dim)
        self.dropout = nn.Dropout(dropout)
    
    def forward(self, x):
        """Voert causale self-attention uit op een batch token vectors."""
        B, T, C = x.shape
        
        Q = self.query(x)
        K = self.key(x)
        V = self.value(x)
        
        scores = Q @ K.transpose(-2, -1)
        scores = scores / math.sqrt(C)
        
        # Dit masker voorkomt dat een token naar toekomstige tokens kijkt.
        mask = torch.tril(torch.ones(T, T)).to(x.device)
        scores = scores.masked_fill(mask == 0, float("-inf"))
        
        weights = torch.softmax(scores, dim=-1)
        weights = self.dropout(weights)
        output = weights @ V
        
        return output


class GPTBlock(nn.Module):
    """Transformer blok met self-attention en feed-forward lagen."""
    
    def __init__(self, embed_dim, dropout=0.0):
        """Maakt een transformer blok met normalisatie en dropout."""
        super().__init__()
        self.attn = SelfAttention(embed_dim, dropout)
        self.ff = nn.Sequential(
            nn.Linear(embed_dim, embed_dim * 4),
            nn.GELU(),
            nn.Linear(embed_dim * 4, embed_dim),
            nn.Dropout(dropout)
        )
        self.norm1 = nn.LayerNorm(embed_dim)
        self.norm2 = nn.LayerNorm(embed_dim)
    
    def forward(self, x):
        """Voert het transformer blok uit met residual connections."""
        x = x + self.attn(self.norm1(x))
        x = x + self.ff(self.norm2(x))
        return x


class ArcLM(nn.Module):
    """Compact GPT-achtig taalmodel voor next-token prediction."""
    
    def __init__(self, vocab_size, embed_dim=64, block_size=8, num_blocks=2, dropout=0.0):
        """Maakt het ArcLM model met token embeddings en transformer blokken."""
        super().__init__()
        
        self.token_embedding = nn.Embedding(vocab_size, embed_dim)
        self.position_embedding = nn.Embedding(block_size, embed_dim)
        self.dropout = nn.Dropout(dropout)
        
        self.blocks = nn.Sequential(
            *[GPTBlock(embed_dim, dropout) for _ in range(num_blocks)]
        )
        
        self.ln = nn.LayerNorm(embed_dim)
        self.head = nn.Linear(embed_dim, vocab_size)
        self.block_size = block_size
    
    def forward(self, idx):
        """Geeft logits terug voor elke tokenpositie in de input."""
        B, T = idx.shape
        
        tok_emb = self.token_embedding(idx)
        pos = torch.arange(T, device=idx.device)
        pos_emb = self.position_embedding(pos)
        
        x = self.dropout(tok_emb + pos_emb)
        x = self.blocks(x)
        x = self.ln(x)
        logits = self.head(x)
        
        return logits
    
    def get_num_parameters(self):
        """Geeft het totale aantal modelparameters terug."""
        return sum(p.numel() for p in self.parameters())


# Deze alias houdt oudere code en checkpoints bruikbaar.
MiniGPT = ArcLM


