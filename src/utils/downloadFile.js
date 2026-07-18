import { toast } from "react-toastify";

export const downloadFile = async (imageSrc, filename = "ticket.png", t) => {
  try {
    const response = await fetch(imageSrc, { mode: "cors" });
    const blob = await response.blob();

    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(blobUrl);
  } catch (error) {
    toast.error(t("download_ticket_error"));
  }
};
