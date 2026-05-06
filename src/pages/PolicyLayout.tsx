import { Link } from "react-router-dom";
import { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
const logo = "https://chatgpt.com/backend-api/estuary/content?id=file_00000000122871f7882a25c21fc89cb1&ts=493899&p=fs&cid=1&sig=0be1797a27bda05fde6babfc4e9156f79fd5cf9de2bbf528df647f68aaa3120e&v=0";

type Props = {
  title: string;
  lastUpdated: string;
  children: ReactNode;
};

const PolicyLayout = ({ title, lastUpdated, children }: Props) => (
  <main className="min-h-screen bg-background">
    <header className="bg-navy text-navy-foreground">
      <div className="container flex h-20 items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="Cell Sync Solutions" className="h-10 w-10" />
          <span className="font-extrabold text-primary">CELL SYNC SOLUTIONS</span>
        </Link>
        <Link to="/" className="text-sm inline-flex items-center gap-2 hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to home
        </Link>
      </div>
    </header>
    <article className="container max-w-3xl py-12">
      <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">{title}</h1>
      <p className="text-sm text-muted-foreground mb-8">Last updated: {lastUpdated}</p>
      <div className="prose prose-slate dark:prose-invert max-w-none space-y-5 text-foreground/90 leading-relaxed [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:tracking-tight [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1 [&_p]:text-[15px]">
        {children}
      </div>
    </article>
  </main>
);

export default PolicyLayout;