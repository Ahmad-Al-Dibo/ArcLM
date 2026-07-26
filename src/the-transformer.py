import math
import numpy as np


# --------------------- Parameter & Utilities ---------------------

class Parameter:
    """A trainable parameter with its gradient and Adam states."""
    def __init__(self, value):
        self.value = value
        self.grad = np.zeros_like(value)
        self.m = np.zeros_like(value)
        self.v = np.zeros_like(value)

    def zero_grad(self):
        self.grad.fill(0)


def softmax(x, axis=-1):
    x_max = np.max(x, axis=axis, keepdims=True)
    e = np.exp(x - x_max)
    return e / np.sum(e, axis=axis, keepdims=True)


def collect_parameters(obj, params=None, seen=None):
    """Recursively collect all Parameter objects in a module."""
    if params is None:
        params = []
    if seen is None:
        seen = set()
    if isinstance(obj, Parameter):
        if id(obj) not in seen:
            params.append(obj)
            seen.add(id(obj))
        return params
    if isinstance(obj, (list, tuple)):
        for item in obj:
            collect_parameters(item, params, seen)
    elif hasattr(obj, "__dict__"):
        for value in vars(obj).values():
            collect_parameters(value, params, seen)
    return params


# --------------------- Basic Layers ---------------------

class Dropout:
    def __init__(self, p=0.1):
        self.p = p
        self.mask = None

    def forward(self, x, training=True):
        if not training or self.p == 0.0:
            self.mask = None
            return x
        self.mask = (np.random.rand(*x.shape) >= self.p).astype(x.dtype) / (1.0 - self.p)
        return x * self.mask

    def backward(self, grad_output, training=True):
        if not training or self.p == 0.0 or self.mask is None:
            return grad_output
        return grad_output * self.mask


class Linear:
    def __init__(self, in_features, out_features, bias=True):
        self.in_features = in_features
        self.out_features = out_features
        limit = math.sqrt(6.0 / (in_features + out_features))
        self.W = Parameter(np.random.uniform(-limit, limit, (out_features, in_features)).astype(np.float32))
        if bias:
            self.b = Parameter(np.zeros(out_features, dtype=np.float32))
        else:
            self.b = None

    def forward(self, x):
        self.x = x
        out = x @ self.W.value.T
        if self.b is not None:
            out = out + self.b.value
        return out

    def backward(self, grad_output):
        x_2d = self.x.reshape(-1, self.in_features)
        dy_2d = grad_output.reshape(-1, self.out_features)

        self.W.grad += dy_2d.T @ x_2d
        if self.b is not None:
            self.b.grad += dy_2d.sum(axis=0)

        dx_2d = dy_2d @ self.W.value
        return dx_2d.reshape(self.x.shape)


class LayerNorm:
    def __init__(self, normalized_shape, eps=1e-6):
        shape = (normalized_shape,) if isinstance(normalized_shape, int) else tuple(normalized_shape)
        self.gamma = Parameter(np.ones(shape, dtype=np.float32))
        self.beta = Parameter(np.zeros(shape, dtype=np.float32))
        self.eps = eps

    def forward(self, x):
        self.x = x
        self.mean = np.mean(x, axis=-1, keepdims=True)
        self.var = np.var(x, axis=-1, keepdims=True)
        self.std_inv = 1.0 / np.sqrt(self.var + self.eps)
        self.norm = (x - self.mean) * self.std_inv
        return self.gamma.value * self.norm + self.beta.value

    def backward(self, grad_output):
        N = self.x.shape[-1]
        dgamma = np.sum(grad_output * self.norm, axis=tuple(range(grad_output.ndim - 1)))
        dbeta = np.sum(grad_output, axis=tuple(range(grad_output.ndim - 1)))
        self.gamma.grad += dgamma
        self.beta.grad += dbeta

        dx_norm = grad_output * self.gamma.value
        dx = (self.std_inv / N) * (
            N * dx_norm
            - np.sum(dx_norm, axis=-1, keepdims=True)
            - self.norm * np.sum(dx_norm * self.norm, axis=-1, keepdims=True)
        )
        return dx


class Embedding:
    def __init__(self, num_embeddings, embedding_dim):
        self.num_embeddings = num_embeddings
        self.embedding_dim = embedding_dim
        limit = math.sqrt(6.0 / (num_embeddings + embedding_dim))
        self.weight = Parameter(
            np.random.uniform(-limit, limit, (num_embeddings, embedding_dim)).astype(np.float32)
        )

    def forward(self, idx):
        self.idx = idx
        return self.weight.value[idx]

    def backward(self, grad_output):
        np.add.at(self.weight.grad, self.idx, grad_output)


class PositionalEncoding:
    def __init__(self, d_model, max_len=5000):
        pe = np.zeros((max_len, d_model), dtype=np.float32)
        position = np.arange(max_len)[:, None].astype(np.float32)
        div_term = np.exp(np.arange(0, d_model, 2) * (-math.log(10000.0) / d_model))
        pe[:, 0::2] = np.sin(position * div_term)
        if d_model % 2 == 1:
            pe[:, 1::2] = np.cos(position * div_term[:-1])
        else:
            pe[:, 1::2] = np.cos(position * div_term)
        self.pe = pe[None, :, :]

    def forward(self, x):
        self.x = x
        return x + self.pe[:, : x.shape[1]]

    def backward(self, grad_output):
        return grad_output


# --------------------- Attention & FFN ---------------------

class MultiHeadAttention:
    def __init__(self, d_model, num_heads, dropout=0.1):
        assert d_model % num_heads == 0
        self.d_model = d_model
        self.num_heads = num_heads
        self.d_k = d_model // num_heads

        self.W_q = Linear(d_model, d_model)
        self.W_k = Linear(d_model, d_model)
        self.W_v = Linear(d_model, d_model)
        self.W_o = Linear(d_model, d_model)
        self.dropout = Dropout(dropout)

    def forward(self, query, key, value, mask=None, training=True):
        self.query = query
        self.key = key
        self.value = value
        self.mask = mask

        B, Tq, _ = query.shape
        _, Tk, _ = key.shape

        Q = self.W_q.forward(query)
        K = self.W_k.forward(key)
        V = self.W_v.forward(value)

        self.Q = Q.reshape(B, Tq, self.num_heads, self.d_k).transpose(0, 2, 1, 3)
        self.K = K.reshape(B, Tk, self.num_heads, self.d_k).transpose(0, 2, 1, 3)
        self.V = V.reshape(B, Tk, self.num_heads, self.d_k).transpose(0, 2, 1, 3)

        if mask is not None:
            if mask.ndim == 2:
                mask = mask[:, None, None, :]
            elif mask.ndim == 3:
                mask = mask[:, None, :, :]

        scores = (self.Q @ self.K.transpose(0, 1, 3, 2)) / math.sqrt(self.d_k)
        if mask is not None:
            scores = np.where(mask, scores, -1e9)
        self.attn = softmax(scores, axis=-1)
        self.attn = self.dropout.forward(self.attn, training=training)

        out = self.attn @ self.V
        out = out.transpose(0, 2, 1, 3).reshape(B, Tq, self.d_model)
        return self.W_o.forward(out), self.attn

    def backward(self, grad_output, training=True):
        B, Tq, D = grad_output.shape
        Tk = self.key.shape[1]

        d_concat = self.W_o.backward(grad_output)
        d_concat = d_concat.reshape(B, Tq, self.num_heads, self.d_k).transpose(0, 2, 1, 3)

        # Gradients w.r.t. attention weights and values
        dV = self.attn.transpose(0, 1, 3, 2) @ d_concat
        dAttn = d_concat @ self.V.transpose(0, 1, 3, 2)

        if training and self.dropout.p > 0:
            dAttn = dAttn * self.dropout.mask

        # Softmax backward
        dScores = self.attn * (dAttn - np.sum(self.attn * dAttn, axis=-1, keepdims=True))
        if self.mask is not None:
            dScores = dScores * self.mask
        dScores = dScores / math.sqrt(self.d_k)

        dQ = dScores @ self.K
        dK = dScores.transpose(0, 1, 3, 2) @ self.Q

        dQ = dQ.transpose(0, 2, 1, 3).reshape(B, Tq, D)
        dK = dK.transpose(0, 2, 1, 3).reshape(B, Tk, D)
        dV = dV.transpose(0, 2, 1, 3).reshape(B, Tk, D)

        dQuery = self.W_q.backward(dQ)
        dKey = self.W_k.backward(dK)
        dValue = self.W_v.backward(dV)

        return dQuery, dKey, dValue


class FeedForward:
    def __init__(self, d_model, d_ff, dropout=0.1):
        self.linear1 = Linear(d_model, d_ff)
        self.linear2 = Linear(d_ff, d_model)
        self.dropout = Dropout(dropout)

    def forward(self, x, training=True):
        self.x = x
        self.a1 = self.linear1.forward(x)
        self.a2 = np.maximum(0, self.a1)
        self.a3 = self.dropout.forward(self.a2, training=training)
        return self.linear2.forward(self.a3)

    def backward(self, grad_output, training=True):
        da3 = self.linear2.backward(grad_output)
        da2 = self.dropout.backward(da3, training=training)
        da1 = da2 * (self.a1 > 0)
        dx = self.linear1.backward(da1)
        return dx


# --------------------- Encoder / Decoder ---------------------

class EncoderLayer:
    def __init__(self, d_model, num_heads, d_ff, dropout=0.1):
        self.d_model = d_model
        self.self_attn = MultiHeadAttention(d_model, num_heads, dropout)
        self.ff = FeedForward(d_model, d_ff, dropout)
        self.norm1 = LayerNorm(d_model)
        self.norm2 = LayerNorm(d_model)
        self.dropout1 = Dropout(dropout)
        self.dropout2 = Dropout(dropout)

    def forward(self, x, mask, training=True):
        self.x = x
        self.mask = mask

        attn_out, _ = self.self_attn.forward(x, x, x, mask, training=training)
        x2 = x + self.dropout1.forward(attn_out, training=training)
        self.x2 = x2

        x2_norm = self.norm1.forward(x2)
        self.x2_norm = x2_norm

        ff_out = self.ff.forward(x2_norm, training=training)
        x3 = x2_norm + self.dropout2.forward(ff_out, training=training)
        self.x3 = x3

        return self.norm2.forward(x3)

    def backward(self, grad_output, training=True):
        dx3 = self.norm2.backward(grad_output)

        d_ff = self.dropout2.backward(dx3, training=training)
        dx2_norm = dx3 + self.ff.backward(d_ff, training=training)

        dx2 = self.norm1.backward(dx2_norm)

        d_attn = self.dropout1.backward(dx2, training=training)
        dx = dx2  # residual

        dQ, dK, dV = self.self_attn.backward(d_attn, training=training)
        dx = dx + dQ + dK + dV
        return dx


class DecoderLayer:
    def __init__(self, d_model, num_heads, d_ff, dropout=0.1):
        self.d_model = d_model
        self.masked_self_attn = MultiHeadAttention(d_model, num_heads, dropout)
        self.cross_attn = MultiHeadAttention(d_model, num_heads, dropout)
        self.ff = FeedForward(d_model, d_ff, dropout)
        self.norm1 = LayerNorm(d_model)
        self.norm2 = LayerNorm(d_model)
        self.norm3 = LayerNorm(d_model)
        self.dropout1 = Dropout(dropout)
        self.dropout2 = Dropout(dropout)
        self.dropout3 = Dropout(dropout)

    def forward(self, x, memory, src_mask, tgt_mask, training=True):
        self.x = x
        self.memory = memory

        attn1, _ = self.masked_self_attn.forward(x, x, x, tgt_mask, training=training)
        x2 = x + self.dropout1.forward(attn1, training=training)
        self.x2 = x2

        x2_norm = self.norm1.forward(x2)
        self.x2_norm = x2_norm

        attn2, _ = self.cross_attn.forward(x2_norm, memory, memory, src_mask, training=training)
        x3 = x2_norm + self.dropout2.forward(attn2, training=training)
        self.x3 = x3

        x3_norm = self.norm2.forward(x3)
        self.x3_norm = x3_norm

        ff_out = self.ff.forward(x3_norm, training=training)
        x4 = x3_norm + self.dropout3.forward(ff_out, training=training)
        self.x4 = x4

        return self.norm3.forward(x4)

    def backward(self, grad_output, training=True):
        dx4 = self.norm3.backward(grad_output)

        d_ff = self.dropout3.backward(dx4, training=training)
        dx3_norm = dx4 + self.ff.backward(d_ff, training=training)

        dx3 = self.norm2.backward(dx3_norm)

        d_attn2 = self.dropout2.backward(dx3, training=training)
        dx2_norm = dx3  # residual

        dQ, dK, dV = self.cross_attn.backward(d_attn2, training=training)
        dx2_norm = dx2_norm + dQ
        dMemory = dK + dV

        dx2 = self.norm1.backward(dx2_norm)

        d_attn1 = self.dropout1.backward(dx2, training=training)
        dx = dx2  # residual

        dQ, dK, dV = self.masked_self_attn.backward(d_attn1, training=training)
        dx = dx + dQ + dK + dV
        return dx, dMemory


class Encoder:
    def __init__(self, layers):
        self.layers = layers
        self.norm = LayerNorm(layers[0].d_model) if layers else None

    def forward(self, x, mask, training=True):
        self.mask = mask
        for layer in self.layers:
            x = layer.forward(x, mask, training=training)
        return self.norm.forward(x) if self.norm else x

    def backward(self, grad_output, mask=None, training=True):
        dx = self.norm.backward(grad_output) if self.norm else grad_output
        for layer in reversed(self.layers):
            dx = layer.backward(dx, training=training)
        return dx


class Decoder:
    def __init__(self, layers):
        self.layers = layers
        self.norm = LayerNorm(layers[0].d_model) if layers else None

    def forward(self, x, memory, src_mask, tgt_mask, training=True):
        self.memory = memory
        self.src_mask = src_mask
        self.tgt_mask = tgt_mask
        for layer in self.layers:
            x = layer.forward(x, memory, src_mask, tgt_mask, training=training)
        return self.norm.forward(x) if self.norm else x

    def backward(self, grad_output, training=True):
        dx = self.norm.backward(grad_output) if self.norm else grad_output
        dMemory_total = 0
        for layer in reversed(self.layers):
            dx, dMemory = layer.backward(dx, training=training)
            dMemory_total += dMemory
        return dx, dMemory_total


# --------------------- Full Transformer ---------------------

class Transformer:
    def __init__(
        self,
        src_vocab_size,
        tgt_vocab_size,
        d_model=512,
        num_heads=8,
        num_layers=6,
        d_ff=2048,
        dropout=0.1,
        max_len=5000,
    ):
        self.d_model = d_model

        self.src_embed = Embedding(src_vocab_size, d_model)
        self.tgt_embed = Embedding(tgt_vocab_size, d_model)
        self.pos_enc = PositionalEncoding(d_model, max_len)

        # Separate dropout objects so encode/decode masks don't overwrite each other
        self.enc_dropout = Dropout(dropout)
        self.dec_dropout = Dropout(dropout)

        enc_layers = [EncoderLayer(d_model, num_heads, d_ff, dropout) for _ in range(num_layers)]
        dec_layers = [DecoderLayer(d_model, num_heads, d_ff, dropout) for _ in range(num_layers)]

        self.encoder = Encoder(enc_layers)
        self.decoder = Decoder(dec_layers)
        self.generator = Linear(d_model, tgt_vocab_size)

    def parameters(self):
        return collect_parameters(self)

    def zero_grad(self):
        for p in self.parameters():
            p.zero_grad()

    def make_src_mask(self, src):
        return (src != 0)[:, None, None, :]

    def make_tgt_mask(self, tgt):
        B, T = tgt.shape
        pad_mask = (tgt != 0)[:, None, :, None]
        causal = np.tril(np.ones((T, T), dtype=bool))
        return pad_mask & causal

    def encode(self, src, src_mask, training=True):
        x = self.src_embed.forward(src) * math.sqrt(self.d_model)
        x = self.pos_enc.forward(x)
        x = self.enc_dropout.forward(x, training=training)
        return self.encoder.forward(x, src_mask, training=training)

    def decode(self, tgt, memory, src_mask, tgt_mask, training=True):
        x = self.tgt_embed.forward(tgt) * math.sqrt(self.d_model)
        x = self.pos_enc.forward(x)
        x = self.dec_dropout.forward(x, training=training)
        return self.decoder.forward(x, memory, src_mask, tgt_mask, training=training)

    def forward(self, src, tgt, training=True):
        self.src = src
        self.tgt = tgt
        self.src_mask = self.make_src_mask(src)
        self.tgt_mask = self.make_tgt_mask(tgt)

        self.memory = self.encode(src, self.src_mask, training=training)
        self.dec_out = self.decode(tgt, self.memory, self.src_mask, self.tgt_mask, training=training)
        return self.generator.forward(self.dec_out)

    def backward(self, d_logits, training=True):
        d_dec_out = self.generator.backward(d_logits)
        d_y, d_memory = self.decoder.backward(d_dec_out, training=training)
        d_x = self.encoder.backward(d_memory, self.src_mask, training=training)

        # Backprop through target embedding path
        d_y = self.dec_dropout.backward(d_y, training=training)
        d_y = self.pos_enc.backward(d_y)
        self.tgt_embed.backward(d_y)

        # Backprop through source embedding path
        d_x = self.enc_dropout.backward(d_x, training=training)
        d_x = self.pos_enc.backward(d_x)
        self.src_embed.backward(d_x)


# --------------------- Loss, Optimizer, Inference ---------------------

class CrossEntropyLoss:
    def __init__(self, ignore_index=0):
        self.ignore_index = ignore_index

    def forward(self, logits, targets):
        self.logits = logits
        self.targets = targets
        self.probs = softmax(logits, axis=-1)

        B, T, V = logits.shape
        flat_probs = self.probs.reshape(-1, V)
        flat_targets = targets.reshape(-1)
        self.mask = flat_targets != self.ignore_index
        n = self.mask.sum()

        if n == 0:
            return 0.0

        log_probs = np.log(flat_probs[np.arange(flat_targets.shape[0]), flat_targets] + 1e-12)
        loss = -np.sum(log_probs[self.mask]) / n
        return loss

    def backward(self):
        B, T, V = self.logits.shape
        flat_targets = self.targets.reshape(-1)
        mask = flat_targets != self.ignore_index
        n = mask.sum()

        dflat = self.probs.reshape(-1, V).copy()
        dflat[np.arange(flat_targets.shape[0])[mask], flat_targets[mask]] -= 1.0
        dflat[~mask] = 0.0

        return dflat.reshape(B, T, V) / max(n, 1)


class Adam:
    def __init__(self, params, lr=1e-4, betas=(0.9, 0.98), eps=1e-9):
        self.params = params
        self.lr = lr
        self.beta1 = betas[0]
        self.beta2 = betas[1]
        self.eps = eps
        self.t = 0

    def zero_grad(self):
        for p in self.params:
            p.zero_grad()

    def step(self):
        self.t += 1
        for p in self.params:
            p.m = self.beta1 * p.m + (1.0 - self.beta1) * p.grad
            p.v = self.beta2 * p.v + (1.0 - self.beta2) * (p.grad ** 2)
            m_hat = p.m / (1.0 - self.beta1 ** self.t)
            v_hat = p.v / (1.0 - self.beta2 ** self.t)
            p.value -= self.lr * m_hat / (np.sqrt(v_hat) + self.eps)


def greedy_decode(model, src, start_symbol=1, end_symbol=2, max_len=50):
    src_mask = model.make_src_mask(src)
    memory = model.encode(src, src_mask, training=False)
    B = src.shape[0]
    ys = np.full((B, 1), start_symbol, dtype=np.int64)

    for _ in range(max_len - 1):
        tgt_mask = model.make_tgt_mask(ys)
        out = model.decode(ys, memory, src_mask, tgt_mask, training=False)
        logits = model.generator.forward(out[:, -1, :])
        next_tokens = np.argmax(logits, axis=-1)

        if end_symbol is not None and np.all(next_tokens == end_symbol):
            break

        ys = np.concatenate([ys, next_tokens[:, None]], axis=1)

    return ys


# --------------------- Training Example ---------------------

if __name__ == "__main__":
    np.random.seed(42)

    SRC_VOCAB = 1000
    TGT_VOCAB = 1000
    BATCH_SIZE = 4
    SEQ_LEN = 16

    model = Transformer(
        src_vocab_size=SRC_VOCAB,
        tgt_vocab_size=TGT_VOCAB,
        d_model=128,
        num_heads=4,
        num_layers=2,
        d_ff=512,
        dropout=0.1,
    )

    criterion = CrossEntropyLoss(ignore_index=0)
    optimizer = Adam(model.parameters(), lr=1e-4)

    # Dummy training loop
    for epoch in range(20):
        src = np.random.randint(1, SRC_VOCAB, size=(BATCH_SIZE, SEQ_LEN), dtype=np.int64)
        tgt = np.random.randint(1, TGT_VOCAB, size=(BATCH_SIZE, SEQ_LEN), dtype=np.int64)

        # Teacher forcing: input is tgt[:, :-1], labels are tgt[:, 1:]
        tgt_input = tgt[:, :-1]
        tgt_labels = tgt[:, 1:]

        logits = model.forward(src, tgt_input, training=True)
        loss = criterion.forward(logits, tgt_labels)

        optimizer.zero_grad()
        d_logits = criterion.backward()
        model.backward(d_logits, training=True)
        optimizer.step()

        if epoch % 5 == 0:
            print(f"Epoch {epoch}, loss: {loss:.4f}")

    # Inference example
    test_src = np.random.randint(1, SRC_VOCAB, size=(1, SEQ_LEN), dtype=np.int64)
    decoded = greedy_decode(model, test_src, start_symbol=1, end_symbol=2, max_len=20)
    print("Decoded sequence:", decoded)