import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { addFile } from "../api/api";

const UploadForm = ({ progress, setProgress }) => {
  const [file, setFile] = useState("");

  const queryClient = useQueryClient();
  const mutation = useMutation(addFile, {
    onSuccess: () => {
      queryClient.invalidateQueries(["file"]);
    },
  });
  const handleFileChange = (e) => {
    setProgress(0);
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    handleFormSubmit(selectedFile);
    setFile("");
  };
  const handleFormSubmit = async (file) => {
    setProgress(0);

    const formData = new FormData();
    formData.append("file", file);

    try {
      await mutation.mutateAsync(formData);
      console.log("file created successfully!");
    } catch (error) {
      console.error("Error creating file:", error);
    }
  };
  return (
    <div className="w-full flex justify-center">
      <form className="relative w-4/5 h-32 max-w-xs mb-10  bg-gray-300 rounded-lg shadow-inner">
        <input
          type="file"
          id="file-upload"
          onChange={(e) => {
            handleFileChange(e);
          }}
          value={file}
          className="hidden"
        />
        <label
          for="file-upload"
          class="z-20 flex flex-col-reverse items-center justify-center w-full h-full cursor-pointer"
        >
          <p class="z-10 text-xs font-light text-center text-white">Upload</p>
          <svg
            class="z-10 w-8 h-8 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"></path>
          </svg>
        </label>
      </form>
    </div>
  );
};

export default UploadForm;
