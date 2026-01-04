import { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { supabaseClient } from '@/lib/supabaseClient';
import { toast } from 'sonner';

interface EditProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditProfileModal({ open, onOpenChange }: EditProfileModalProps) {
  const { user, checkSession } = useAuth();
  const [fullName, setFullName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [tempAvatarUrl, setTempAvatarUrl] = useState(''); // Local preview

  // Reset on close, sync on open
  useEffect(() => {
    if (!open) {
      setFullName('');
      setAvatarUrl('');
      setTempAvatarUrl('');
      return;
    }
    if (user) {
      setFullName(user.fullName || '');
      setAvatarUrl(user.avatar_url || '');
      setTempAvatarUrl(user.avatar_url || '');
    }
  }, [open, user]);

  // Secure file upload with validation
  const handleAvatarChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    
    if (file.size > MAX_FILE_SIZE) {
      toast.error('Image must be under 5MB');
      return;
    }
    if (!ALLOWED_TYPES.includes(file.type.toLowerCase())) {
      toast.error('Only JPG, PNG, WebP, GIF allowed');
      return;
    }

    setUploading(true);
    try {
      // ✅ SIMPLEST PATH: Root level + fixed filename
      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const filePath = `${user.id}.${fileExt}`; // "abc123.jpg"
      
      setTempAvatarUrl(URL.createObjectURL(file));

      // ✅ UPSERT replaces old file automatically (no list/remove needed!)
      const { error: uploadError } = await supabaseClient.storage
        .from('avatars')
        .upload(filePath, file, { 
          upsert: true,
          contentType: file.type 
        });
      
      if (uploadError) {
        console.error('Upload error:', uploadError);
        toast.error('Upload failed: ' + uploadError.message);
        return;
      }

      // Get public URL
      const { data } = supabaseClient.storage
        .from('avatars')
        .getPublicUrl(filePath);
      
      if (data?.publicUrl) {
        setAvatarUrl(data.publicUrl);
        // Update DB
        await supabaseClient.from('users').update({ avatar_url: data.publicUrl }).eq('id', user.id);
        checkSession();
        toast.success('Avatar updated!');
      }
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  }, [user, checkSession]);

  const handleSave = async () => {
    if (!user || (!fullName.trim() && !avatarUrl)) return;
    setSaving(true);
    try {
      const { error } = await supabaseClient
        .from('users')
        .update({ 
          full_name: fullName.trim(), 
          avatar_url: avatarUrl || null 
        })
        .eq('id', user.id);
      if (error) {
        toast.error('Profile update failed');
        return;
      }
      toast.success('Profile updated!');
      checkSession();
      onOpenChange(false);
    } catch (error) {
      toast.error('Save failed');
    } finally {
      setSaving(false);
    }
  };

  // Remove avatar logic
  const handleRemoveAvatar = useCallback(async () => {
    if (!user) return;
    setUploading(true);
    try {
      const { data: files, error: listError } = await supabaseClient.storage.from('avatars').list('', { search: user.id });
      if (listError) console.error('Supabase list error:', listError);
      if (files && files.length > 0) {
        for (const file of files) {
          if (file.name.startsWith(user.id)) {
            const { error: removeError } = await supabaseClient.storage.from('avatars').remove([file.name]);
            if (removeError) console.error('Supabase remove error:', removeError);
          }
        }
      }
      setAvatarUrl('');
      setTempAvatarUrl('');
      const { error: dbError } = await supabaseClient.from('users').update({ avatar_url: null }).eq('id', user.id);
      if (dbError) console.error('Supabase DB error:', dbError);
      checkSession();
      toast.success('Profile picture removed');
    } catch (err) {
      console.error('Avatar remove exception:', err);
      toast.error('Failed to remove profile picture');
    } finally {
      setUploading(false);
    }
  }, [user, checkSession]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-2">
          <label htmlFor="avatar-upload" className="cursor-pointer group">
            <Avatar className="h-20 w-20 ring-2 ring-transparent group-hover:ring-blue-500 transition-all">
              <AvatarImage src={tempAvatarUrl || avatarUrl} alt={fullName} />
              <AvatarFallback>{(fullName || user?.email || '?')[0]}</AvatarFallback>
            </Avatar>
            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              </div>
            )}
            <input 
              id="avatar-upload" 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleAvatarChange} 
              disabled={uploading || saving}
            />
          </label>
          <div className="flex gap-2 mt-1">
            <Button variant="outline" size="sm" type="button" onClick={handleRemoveAvatar} disabled={uploading || saving || (!avatarUrl && !tempAvatarUrl)}>
              Remove Profile Pic
            </Button>
            <Button variant="outline" size="sm" type="button" asChild>
              <label htmlFor="avatar-upload" className="cursor-pointer m-0">Change Pic</label>
            </Button>
          </div>
          <Input
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            placeholder="Full Name"
            className="w-full max-w-md"
            disabled={saving || uploading}
          />
        </div>
        <DialogFooter>
          <Button 
            onClick={handleSave} 
            disabled={saving || uploading || (!fullName.trim() && !avatarUrl && !tempAvatarUrl)}
            className="w-full"
          >
            {saving ? 'Saving...' : uploading ? 'Uploading...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
