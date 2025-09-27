import markdownStyles from "./markdown-styles.module.css";
import { PostVideo } from "./post-video";

type Props = {
  content: string;
  video?: string;
};

export function PostBody({ content, video }: Props) {

  const hasVideo = !!video && video.trim() !== "";

  return (
    <div className="max-w-2xl mx-auto">
      <div
        className={markdownStyles["markdown"]}
        dangerouslySetInnerHTML={{ __html: content }}
      />
      {hasVideo && (
        <div className = "flex justify-center my-6">
          <PostVideo video={video!} />
        </div>
      )}
    </div>
  );
}
