interface ProfileHeaderProps {
  profileImage: string
  name: string
}

export function ProfileHeader({ profileImage, name }: ProfileHeaderProps) {
  return (
    <div className="flex items-center space-x-4">
      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-border bg-card">
        <img 
          src={profileImage} 
          alt="Profile" 
          className="w-full h-full object-cover"
        />
      </div>
      <h2 className="text-2xl font-handwritten font-bold text-foreground">
        {name}
      </h2>
    </div>
  )
}