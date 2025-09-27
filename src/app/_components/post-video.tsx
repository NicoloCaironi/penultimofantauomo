type Props = { video: string };

export function PostVideo({ video }: Props) {
  if (!video) return null;
  return (
    <div className="flex justify-center my-6">
      <video
        controls
        width="800"
        style={{ maxWidth: '100%', height: 'auto' }}
        playsInline
      >
        <source src={video} type="video/mp4" />
        Il tuo browser non supporta il tag video.
      </video>
    </div>
  );
}