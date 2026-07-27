"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  KeyValueList,
  Skeleton
} from "@/components/ui";
import { ApiClientError, createApiClient } from "@/lib/api/client";
import type { StudioProject } from "@/lib/api/schemas";

export type StudioClient = ReturnType<typeof createApiClient>;

export const formatChoices = [
  { id: "plain_text", label: "Plain text", fields: "text" },
  { id: "prompt_completion", label: "Prompt + Completion", fields: "prompt,completion" },
  { id: "instruction_response", label: "Instruction + Response", fields: "instruction,response" },
  { id: "chat_messages", label: "Chat Messages", fields: "messages" },
  { id: "custom_fields", label: "Custom fields", fields: "text" }
];

export function formatTime(value: number) {
  return new Date(value * 1000).toLocaleString();
}

export function errorMessage(error: unknown) {
  if (error instanceof ApiClientError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "The request failed.";
}

export function useStudioClient(client?: StudioClient) {
  return useMemo(() => client ?? createApiClient(), [client]);
}

export function fieldsFromString(value: string) {
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}

export function LoadingCard({ title }: { title: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>Loading ArcLM Studio data.</CardDescription>
      </CardHeader>
      <CardContent>
        <Skeleton label={`Loading ${title}`} />
      </CardContent>
    </Card>
  );
}

export function ProjectCard({ project, onDelete }: { project: StudioProject; onDelete?: (project: StudioProject) => void }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{project.name}</CardTitle>
        <CardDescription>{project.description || "No description yet."}</CardDescription>
      </CardHeader>
      <CardContent className="studio-card-actions">
        <KeyValueList
          items={[
            { label: "Status", value: project.status },
            { label: "Updated", value: formatTime(project.updated_at) },
            { label: "Active dataset", value: project.active_dataset_id ?? "None" },
            { label: "Active tokenizer", value: project.active_tokenizer_id ?? "None" }
          ]}
        />
        <div className="studio-actions">
          <Link className="ui-button ui-button-primary" href={`/projects/${project.id}`}>
            Open project
          </Link>
          <Link className="ui-button ui-button-secondary" href={`/projects/${project.id}/data`}>
            Data
          </Link>
          <Link className="ui-button ui-button-secondary" href={`/projects/${project.id}/tokenizer`}>
            Tokenizer
          </Link>
          {onDelete ? (
            <Button variant="destructive" onClick={() => onDelete(project)}>
              Delete
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
