type Props = {
  name: string;
  picture: string;
};

const Avatar = ({ name, picture }: Props) => {
  return (
    <div className="flex items-center gap-3">
      <img src={picture}
      className="w-12 h-12 rounded-full" alt={name} />
      <div className="font-sans text-[13px] font-semibold uppercase tracking-[.05em] text-ink3">{name}</div>
    </div>
  );
};

export default Avatar;
