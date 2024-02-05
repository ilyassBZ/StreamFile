import API_URL from "../utils/api";
import axios from "axios";
// import { useQuery } from "react-query";

export const addFile = async (fileData) => {
  const chunkSize = 1024;
  try {
    const file = fileData.get("file");
    const totalChunks = Math.ceil(file.size / chunkSize);
    const sendChunk = async (start, end) => {
      const formData = new FormData();
      const blobSlice = file.slice(start, end);
      formData.append("file", blobSlice, file.name);
      console.log(formData);
      try {
        await axios.post(`${API_URL}/upload`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } catch (error) {
        console.error("Error uploading chunk:", error);
      }
    };
    for (let i = 0; i < totalChunks; i++) {
      const start = i * chunkSize;
      const end = (i + 1) * chunkSize;
      await sendChunk(start, end);
    }
  } catch (error) {
    throw new Error(error);
  }
};

export const handleSearch = async (keyword) => {
  try {
    const response = await axios.get(`${API_URL}/search`, {
      params: { keyword: keyword },
    });
    return response;
    //
    // console.log(response);
    // const blob = new Blob([response.data], { type: "text/plain" });
    // const url = window.URL.createObjectURL(blob);
    //
    // const link = document.createElement("a");
    // link.href = url;
    // link.download = "search_results.txt";
    // link.click();
  } catch (error) {
    console.error("Error:", error);
  }
};
