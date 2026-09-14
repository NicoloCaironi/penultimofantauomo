import { HeroPost } from "@/app/_components/hero-post";
import Intro from "@/app/_components/intro";
import MastheadNav from "./_components/masthead-nav";
import { MoreStories } from "@/app/_components/more-stories";
import { getAllPosts } from "@/lib/api";
//import {Briefs} from "@/app/_components/briefs";
//import {SidebarResults} from "@/_components/sidebar-results";



export default function Index() {
  const allPosts = getAllPosts();

  //allPosts.sort((a, b) => a.date.localeCompare(b.date));

  const heroPost = allPosts[allPosts.length - 1];

  // show all but the hero post
  const morePosts = allPosts.slice(0, allPosts.length - 1);

  morePosts.sort((a, b) => b.date.localeCompare(a.date));

  return (
    <main>
        <Intro />
        <MastheadNav />

         <div className="grid grid-cols-[200px_1fr_300px] gap-0 px-11">
        <aside className="border-r border-ink/30 pr-6 pt-8">
          { /* <Briefs /> */ }
        </aside>

        <div className="px-6 pt-8">
<HeroPost
          title={heroPost.title}
          coverImage={heroPost.coverImage}
          date={heroPost.date}
          author={heroPost.author}
          slug={heroPost.slug}
          excerpt={heroPost.excerpt}
          content={heroPost.content}
          giornata={heroPost.giornata}
        />        </div>

        <aside className="border-l border-ink/30 pl-6 pt-8">
          { /* <SidebarResults /> */ }
        </aside>
      </div>
        
        {morePosts.length > 0 && <MoreStories posts={morePosts} />}
    </main>
  );
}
