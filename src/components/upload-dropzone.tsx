import { useDropzone } from "react-dropzone";
import type { FileWithPath } from "react-dropzone";

import { cn } from "~/lib/utils";
import { generateClientDropzoneAccept } from "uploadthing/client";

interface UploadDropzoneProps {
  onDrop: (acceptedFiles: FileWithPath[]) => void;
  permittedFileInfo:
    | {
        slug: string;
        maxSize: string;
        fileTypes: string[];
      }
    | undefined;
}

const UploadDropzone = (props: UploadDropzoneProps) => {
  const { maxSize, fileTypes } = props.permittedFileInfo ?? {};

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: props.onDrop,
    accept: fileTypes ? generateClientDropzoneAccept(fileTypes) : undefined,
    multiple: false,
  });

  return (
    <div
      className={cn(
        "flex justify-center rounded-lg border border-dashed px-6 py-10",
        isDragActive ? "bg-blue-600/10" : ""
      )}
    >
      <div className="text-center" {...getRootProps()}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          className="mx-auto h-12 w-12 text-gray-400"
        >
          <path
            fill="currentColor"
            fillRule="evenodd"
            d="M5.5 17a4.5 4.5 0 0 1-1.44-8.765a4.5 4.5 0 0 1 8.302-3.046a3.5 3.5 0 0 1 4.504 4.272A4 4 0 0 1 15 17H5.5Zm3.75-2.75a.75.75 0 0 0 1.5 0V9.66l1.95 2.1a.75.75 0 1 0 1.1-1.02l-3.25-3.5a.75.75 0 0 0-1.1 0l-3.25 3.5a.75.75 0 1 0 1.1 1.02l1.95-2.1v4.59Z"
            clipRule="evenodd"
          ></path>
        </svg>
        <div className="mt-4 flex text-sm leading-6 text-gray-600">
          <label
            htmlFor="file-upload"
            className="relative cursor-pointer font-semibold text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 hover:text-blue-500"
          >
            {`Choose files`}
            <input className="sr-only" {...getInputProps()} />
          </label>
          <p className="pl-1">{`or drag and drop`}</p>
        </div>
        <div className="h-[1.25rem]">
          {fileTypes && (
            <p className="text-xs leading-5 text-gray-600">
              {`${fileTypes.join(", ")}`} {maxSize && `up to ${maxSize}`}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadDropzone;
