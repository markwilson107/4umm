import Avatar from "boring-avatars";
import categoryIcons from "@/config/categoryIcons";
import { registerSchema } from "@/validation/authSchemas";
import { avatarSchema } from "@/validation/userSchemas";
const avatars = avatarSchema.options;

type Props = {
  seed: string;
  avatar: any;
  setAvatar: (avatar: any) => void;
};

function AvatarSelect({ setAvatar, avatar, seed }: Props) {
  return (
    <div className="flex w-full gap-1 mb-2 overflow-y-auto">
      {avatars.map((a, i) => (
        <div key={`avatar-${a}-${i}`} className="relative w-[54px] h-[54px] p-2 flex-shrink-0 cursor-pointer">
          {avatar === a && (
            <div className="absolute top-0 left-0 w-full h-full border-4 border-theme rounded-full"></div>
          )}
          <Avatar
            onClick={() => setAvatar(a)}
            name={seed}
            variant={a}
            size={48}
            className="absolute top-[3px] left-[3px]"
            colors={Object.keys(categoryIcons).map(
              (c) => categoryIcons[c].color
            )}
          />
        </div>
      ))}
    </div>
  );
}

export default AvatarSelect;
