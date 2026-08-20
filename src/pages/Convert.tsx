import { FormEvent, useState } from "react";
import {
  Alert,
  Button,
  Container,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { confirmUpload, createUpload, getJob, putToBlob } from "../api";

const FORMATS = ["png", "jpeg", "webp"];

function FormatPicker({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <>
      <Typography variant="subtitle2">{label}</Typography>
      <ToggleButtonGroup value={value} exclusive onChange={(_, v) => v && onChange(v)}>
        {FORMATS.map((f) => (
          <ToggleButton key={f} value={f}>
            {f}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </>
  );
}

export default function Convert() {
  const [from, setFrom] = useState("png");
  const [to, setTo] = useState("webp");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setStatus(null);
    setDownloadUrl(null);
    if (!file) {
      setError("Pick a file first");
      return;
    }
    try {
      const upload = await createUpload({
        filename: file.name,
        content_type: file.type,
        tool: "image-convert",
        from_format: from,
        to_format: to,
      });
      await putToBlob(upload.upload_url, file);
      await confirmUpload(upload.job_id);

      let job = await getJob(upload.job_id);
      for (let i = 0; i < 10 && job.status === "pending"; i++) {
        await new Promise((r) => setTimeout(r, 500));
        job = await getJob(upload.job_id);
      }
      setStatus(`Job ${job.job_id}: ${job.status}`);
      if (job.output_url) setDownloadUrl(job.output_url);
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <Container maxWidth="xs">
      <Stack component="form" onSubmit={handleSubmit} spacing={2}>
        <Typography variant="h5" component="h1">
          Image convert
        </Typography>

        <FormatPicker label="From" value={from} onChange={setFrom} />
        <FormatPicker label="To" value={to} onChange={setTo} />

        <Button component="label">
          {file ? file.name : "Choose file"}
          <input type="file" hidden onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        </Button>

        {error && <Alert severity="error">{error}</Alert>}
        {status && <Alert severity="info">{status}</Alert>}
        {downloadUrl && (
          <Button component="a" href={downloadUrl} download variant="outlined">
            Download result
          </Button>
        )}

        <Button type="submit" variant="contained">
          Convert
        </Button>
      </Stack>
    </Container>
  );
}
