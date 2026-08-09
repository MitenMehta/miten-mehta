import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, ExternalLink } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface LinkedInPost {
  id: string;
  content: string;
  image_url: string | null;
  post_url: string;
  posted_at: string;
  status: string;
  display_order: number;
  created_at: string;
}

const emptyForm = {
  content: '',
  image_url: '',
  post_url: '',
  posted_at: new Date().toISOString().slice(0, 10),
  status: 'draft',
  display_order: 0,
};

export default function LinkedInPosts() {
  const [posts, setPosts] = useState<LinkedInPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<LinkedInPost | null>(null);
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('linkedin_posts')
        .select('*')
        .order('posted_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      toast.error('Failed to fetch LinkedIn posts');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingPost(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const postData = {
        content: formData.content,
        image_url: formData.image_url || null,
        post_url: formData.post_url,
        posted_at: new Date(formData.posted_at).toISOString(),
        status: formData.status,
        display_order: Number(formData.display_order) || 0,
      };

      if (editingPost) {
        const { error } = await supabase
          .from('linkedin_posts')
          .update(postData)
          .eq('id', editingPost.id);

        if (error) throw error;
        toast.success('Post updated successfully');
      } else {
        const { error } = await supabase
          .from('linkedin_posts')
          .insert([postData]);

        if (error) throw error;
        toast.success('Post added successfully');
      }

      setIsDialogOpen(false);
      resetForm();
      fetchPosts();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save post');
      console.error('Error:', error);
    }
  };

  const handleEdit = (post: LinkedInPost) => {
    setEditingPost(post);
    setFormData({
      content: post.content,
      image_url: post.image_url || '',
      post_url: post.post_url,
      posted_at: post.posted_at.slice(0, 10),
      status: post.status,
      display_order: post.display_order,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this LinkedIn post from the grid?')) return;

    try {
      const { error } = await supabase.from('linkedin_posts').delete().eq('id', id);
      if (error) throw error;
      toast.success('Post deleted');
      fetchPosts();
    } catch (error) {
      toast.error('Failed to delete post');
      console.error('Error:', error);
    }
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">LinkedIn Posts</h1>
          <p className="text-muted-foreground">
            Manually log posts from{' '}
            <a
              href="https://www.linkedin.com/in/mitenmehta/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              linkedin.com/in/mitenmehta
            </a>{' '}
            to display them in the homepage grid.
          </p>
        </div>

        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Post
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingPost ? 'Edit Post' : 'Add LinkedIn Post'}</DialogTitle>
              <DialogDescription>
                Paste in the post text and a link to the live LinkedIn post.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="content">Post text</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={5}
                  placeholder="Paste the LinkedIn post caption here..."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="post_url">LinkedIn post URL</Label>
                <Input
                  id="post_url"
                  type="url"
                  value={formData.post_url}
                  onChange={(e) => setFormData({ ...formData, post_url: e.target.value })}
                  placeholder="https://www.linkedin.com/posts/mitenmehta_..."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image_url">Image URL (optional)</Label>
                <Input
                  id="image_url"
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="Link to a screenshot/image for the post thumbnail"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="posted_at">Posted on</Label>
                  <Input
                    id="posted_at"
                    type="date"
                    value={formData.posted_at}
                    onChange={(e) => setFormData({ ...formData, posted_at: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="display_order">Display order</Label>
                  <Input
                    id="display_order"
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft (hidden from site)</SelectItem>
                    <SelectItem value="published">Published (shown on site)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingPost ? 'Update Post' : 'Add Post'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {posts.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No LinkedIn posts logged yet. Add your first one!</p>
            </CardContent>
          </Card>
        ) : (
          posts.map((post) => (
            <Card key={post.id}>
              <CardHeader>
                <div className="flex justify-between items-start gap-4">
                  <div className="min-w-0">
                    <CardTitle className="text-base line-clamp-2">{post.content}</CardTitle>
                    <CardDescription>
                      {post.status === 'published' ? '✅ Published' : '📝 Draft'} •{' '}
                      {new Date(post.posted_at).toLocaleDateString()} • order {post.display_order}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button variant="outline" size="sm" asChild>
                      <a href={post.post_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleEdit(post)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(post.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}