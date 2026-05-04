import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LiveText } from "@/components/ui/live-text";

const FileManager = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    setFiles(selectedFiles);
  };

  const handleUpload = () => {
    // Simulate upload process
    const fileNames = files.map(file => file.name);
    setUploadedFiles(prev => [...prev, ...fileNames]);
    setFiles([]);
  };

  const handleDelete = (fileName: string) => {
    setUploadedFiles(prev => prev.filter(name => name !== fileName));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        <LiveText as="span" id="file-mgr-title" defaultText="File Manager" />
      </h1>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>
            <LiveText as="span" id="file-mgr-upload-title" defaultText="Upload Files" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="file-upload">
              <LiveText as="span" id="file-mgr-upload-label" defaultText="Select files to upload:" />
            </Label>
            <Input
              id="file-upload"
              type="file"
              multiple
              onChange={handleFileChange}
              accept=".zip,.pdf,.txt,.jpg,.png"
            />
            <Button onClick={handleUpload} disabled={files.length === 0}>
              <LiveText as="span" id="file-mgr-upload-btn" defaultText="Upload Files" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <LiveText as="span" id="file-mgr-list-title" defaultText="Uploaded Files" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          {uploadedFiles.length === 0 ? (
            <p>
              <LiveText as="span" id="file-mgr-empty" defaultText="No files uploaded yet." />
            </p>
          ) : (
            <ul className="space-y-2">
              {uploadedFiles.map((fileName, index) => (
                <li key={index} className="flex justify-between items-center">
                  <span>{fileName}</span>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(fileName)}
                  >
                    <LiveText as="span" id={`file-mgr-delete-${fileName.replace(/\W/g, "_")}`} defaultText="Delete" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FileManager;
