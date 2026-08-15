import { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  published_at: string;
  created_at: string;
}

export default function ArticleDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchArticle = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .maybeSingle();

      if (error) throw error;
      
      if (!data) {
        navigate('/404');
        return;
      }

      setArticle(data);
    } catch (error) {
      console.error('Error fetching article:', error);
      navigate('/404');
    } finally {
      setLoading(false);
    }
  }, [navigate, slug]);

  useEffect(() => {
    if (slug) {
      void fetchArticle();
    }
  }, [fetchArticle, slug]);

  const estimateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return minutes;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading article...</div>
      </div>
    );
  }

  if (!article) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold">
              Miten Mehta
            </Link>
            <div className="flex gap-4">
              <Button variant="ghost" asChild>
                <Link to="/">Home</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link to="/articles">Articles</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Article Content */}
      <article className="py-12 px-4">
        <div className="container mx-auto max-w-3xl">
          <Button variant="ghost" asChild className="mb-8">
            <Link to="/articles">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Articles
            </Link>
          </Button>

          <Card>
            <CardContent className="p-8 md:p-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                {article.title}
              </h1>

              <div className="flex flex-wrap gap-4 mb-8 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {new Date(article.published_at || article.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{estimateReadTime(article.content)} min read</span>
                </div>
              </div>

              {article.excerpt && (
                <p className="text-xl text-muted-foreground mb-8 pb-8 border-b border-border">
                  {article.excerpt}
                </p>
              )}

              <div className="prose prose-lg max-w-none dark:prose-invert">
                <div className="whitespace-pre-wrap">{article.content}</div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <Button asChild>
              <Link to="/articles">
                <ArrowLeft className="mr-2 h-4 w-4" />
                View All Articles
              </Link>
            </Button>
          </div>
        </div>
      </article>
    </div>
  );
}
