"use client";

import { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ErrorState,
  KeyValueList,
  PageHeader,
  Select,
  Textarea,
  TextInput
} from "@/components/ui";
import type { StudioDatasetMetadata, StudioTokenizerMetadata, TokenizerInspectionResponse } from "@/lib/api/schemas";
import { errorMessage, type StudioClient, useStudioClient } from "./shared";

export function TokenizerLabPage({ projectId, client }: { projectId: string; client?: StudioClient }) {
  const api = useStudioClient(client);
  const [datasets, setDatasets] = useState<StudioDatasetMetadata[]>([]);
  const [tokenizers, setTokenizers] = useState<StudioTokenizerMetadata[]>([]);
  const [datasetId, setDatasetId] = useState("");
  const [tokenizerId, setTokenizerId] = useState("");
  const [tokenizerName, setTokenizerName] = useState("native-word-tokenizer");
  const [tokenizerType, setTokenizerType] = useState<"word" | "sentencepiece">("word");
  const [sentencepieceModelType, setSentencepieceModelType] = useState<"bpe" | "unigram" | "char" | "word">("bpe");
  const [maxVocab, setMaxVocab] = useState("2000");
  const [text, setText] = useState("ArcLM makes language models understandable.");
  const [inspection, setInspection] = useState<TokenizerInspectionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    const [datasetData, tokenizerData] = await Promise.all([
      api.listProjectDatasets(projectId),
      api.listProjectTokenizers(projectId)
    ]);
    setDatasets(datasetData.datasets);
    setTokenizers(tokenizerData.tokenizers);
    setDatasetId((current) => current || datasetData.datasets[0]?.id || "");
    setTokenizerId((current) => current || tokenizerData.tokenizers[0]?.id || "");
  }

  useEffect(() => {
    let active = true;
    Promise.all([api.listProjectDatasets(projectId), api.listProjectTokenizers(projectId)])
      .then(([datasetData, tokenizerData]) => {
        if (!active) return;
        setDatasets(datasetData.datasets);
        setTokenizers(tokenizerData.tokenizers);
        setDatasetId(datasetData.datasets[0]?.id ?? "");
        setTokenizerId(tokenizerData.tokenizers[0]?.id ?? "");
      })
      .catch((requestError) => {
        if (active) setError(errorMessage(requestError));
      });
    return () => {
      active = false;
    };
  }, [api, projectId]);

  async function createTokenizer() {
    if (!datasetId) return;
    try {
      const tokenizer = await api.createNativeTokenizer(projectId, {
        name: tokenizerName,
        dataset_id: datasetId,
        tokenizer_type: tokenizerType,
        sentencepiece_model_type: sentencepieceModelType,
        max_vocab: Number(maxVocab) || 2000,
        text_fields: ["instruction", "response", "text"]
      });
      await refresh();
      setTokenizerId(tokenizer.id);
      setError(null);
    } catch (requestError) {
      setError(errorMessage(requestError));
    }
  }

  async function inspectText() {
    if (!tokenizerId) return;
    try {
      setInspection(await api.inspectProjectTokenizer(projectId, tokenizerId, { text }));
      setError(null);
    } catch (requestError) {
      setError(errorMessage(requestError));
    }
  }

  async function deleteTokenizer() {
    if (!tokenizerId || !window.confirm("Delete the selected tokenizer from this project?")) {
      return;
    }
    try {
      await api.deleteProjectTokenizer(projectId, tokenizerId);
      setInspection(null);
      setTokenizerId("");
      await refresh();
      setError(null);
    } catch (requestError) {
      setError(errorMessage(requestError));
    }
  }

  return (
    <div className="studio-page">
      <PageHeader title="Tokenizer Lab" description="Create a native ArcLM word or SentencePiece tokenizer from project data and inspect token IDs." />
      {error ? <ErrorState title="Tokenizer request failed" description={error} /> : null}
      <div className="studio-two-column">
        <Card>
          <CardHeader><CardTitle>Create native tokenizer</CardTitle><CardDescription>Uses ArcLM word or SentencePiece tokenizers; no external downloads.</CardDescription></CardHeader>
          <CardContent className="studio-form">
            <TextInput label="Tokenizer name" value={tokenizerName} onChange={(event) => setTokenizerName(event.target.value)} />
            <Select label="Source dataset" value={datasetId} onChange={(event) => setDatasetId(event.target.value)}>
              <option value="">Select dataset</option>
              {datasets.map((dataset) => <option key={dataset.id} value={dataset.id}>{dataset.name}</option>)}
            </Select>
            <Select label="Tokenizer type" value={tokenizerType} onChange={(event) => {
              const nextType = event.target.value as "word" | "sentencepiece";
              setTokenizerType(nextType);
              setTokenizerName(nextType === "sentencepiece" ? "native-sentencepiece-tokenizer" : "native-word-tokenizer");
            }}>
              <option value="word">Word tokenizer</option>
              <option value="sentencepiece">SentencePiece tokenizer</option>
            </Select>
            {tokenizerType === "sentencepiece" ? (
              <Select label="SentencePiece model" value={sentencepieceModelType} onChange={(event) => setSentencepieceModelType(event.target.value as "bpe" | "unigram" | "char" | "word")}>
                <option value="bpe">BPE</option>
                <option value="unigram">Unigram</option>
                <option value="char">Character</option>
                <option value="word">Word</option>
              </Select>
            ) : null}
            <TextInput label="Maximum vocabulary" type="number" value={maxVocab} onChange={(event) => setMaxVocab(event.target.value)} />
            <Button onClick={() => void createTokenizer()} disabled={!datasetId || !tokenizerName.trim()}>Create native tokenizer</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Inspect tokenizer</CardTitle><CardDescription>Tokenize text and show IDs, unknowns, and decoding.</CardDescription></CardHeader>
          <CardContent className="studio-form">
            <Select label="Tokenizer" value={tokenizerId} onChange={(event) => setTokenizerId(event.target.value)}>
              <option value="">Select tokenizer</option>
              {tokenizers.map((tokenizer) => {
                const kind = tokenizer.tokenizer_type ?? "word";
                const label = kind === "sentencepiece" && tokenizer.sentencepiece_model_type
                  ? `${kind}/${tokenizer.sentencepiece_model_type}`
                  : kind;
                return <option key={tokenizer.id} value={tokenizer.id}>{tokenizer.name} - {label} ({tokenizer.vocab_size})</option>;
              })}
            </Select>
            <Textarea label="Text" value={text} onChange={(event) => setText(event.target.value)} />
            <div className="studio-actions">
              <Button onClick={() => void inspectText()} disabled={!tokenizerId || !text.trim()}>Inspect text</Button>
              <Button variant="destructive" onClick={() => void deleteTokenizer()} disabled={!tokenizerId}>Delete tokenizer</Button>
            </div>
          </CardContent>
        </Card>
      </div>
      {inspection ? (
        <Card>
          <CardHeader><CardTitle>Tokenizer inspection</CardTitle><CardDescription>Real output from the project tokenizer.</CardDescription></CardHeader>
          <CardContent>
            <KeyValueList items={[
              { label: "Tokenizer", value: inspection.tokenizer_class },
              { label: "Vocabulary size", value: inspection.vocab_size },
              { label: "Token count", value: inspection.token_count },
              { label: "Unknown tokens", value: inspection.unknown_token_count },
              { label: "Round trip", value: inspection.round_trip_matches ? "Matches" : "Differs" },
              { label: "Decoded text", value: inspection.decoded_text }
            ]} />
            <div className="studio-token-row">{inspection.tokens.map((token, index) => <span key={`${token}-${index}`}>{token}<code>{inspection.token_ids[index]}</code></span>)}</div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
