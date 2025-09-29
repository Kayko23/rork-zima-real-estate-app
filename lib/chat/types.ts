export type MsgFile = {
  url: string;       // URL distante (après upload)
  name: string;
  mime: string;
  size?: number;     // en octets
  width?: number;    // si image
  height?: number;
};

export type ChatMessage =
  | { id: string; type: "text";   text: string;   createdAt: number; senderId: string; }
  | { id: string; type: "file";   file: MsgFile;  createdAt: number; senderId: string; }
  | { id: string; type: "image";  file: MsgFile;  createdAt: number; senderId: string; };