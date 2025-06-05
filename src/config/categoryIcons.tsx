import ChatIcon from "@/assets/chat";
import ControllerIcon from "@/assets/controller";
import LaptopIcon from "@/assets/laptop";
import MusicNote from "@/assets/music-note";
import { ReactNode } from "react";

export default {
  general: { icon: <ChatIcon />, color: "#2F85FF" },
  tech: { icon: <LaptopIcon />, color: "#7A87F8" },
  music: { icon: <MusicNote />, color: "#F56FA0" },
  gaming: { icon: <ControllerIcon />, color: "#FDB256" },
} as { [id: string]: { icon: ReactNode; color: string } };