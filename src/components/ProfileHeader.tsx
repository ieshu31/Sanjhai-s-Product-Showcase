interface ProfileHeaderProps {
  name: string;
}

export function ProfileHeader({ name }: ProfileHeaderProps) {
  return (
    <div className="flex items-center space-x-3">
      <div className="w-12 h-12 rounded-full overflow-hidden bg-accent flex items-center justify-center">
        <img
          src="/Sanj Notion Pic.png"
          alt="Profile"
          className="w-full h-full object-cover"
        />
      </div>
      <span className="text-lg font-medium text-foreground">{name}</span>
    </div>
  );
}
