import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useStudentProfile } from '../hooks/useStudentProfile';
import { ProfileCompletionIndicator } from '../components/ProfileCompletionIndicator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { X } from 'lucide-react';

export function ProfileEdit() {
  const navigate = useNavigate();
  const { profile, updateProfile, isUpdating, isLoading } = useStudentProfile();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cgpa: '',
    branches: [] as string[],
    branchInput: '',
    skills: [] as string[],
    skillInput: '',
    resumeLink: '',
    bio: '',
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name,
        email: profile.email,
        cgpa: profile.cgpa.toString(),
        branches: profile.branches,
        branchInput: '',
        skills: profile.skills,
        skillInput: '',
        resumeLink: profile.resumeLink,
        bio: profile.bio,
      });
    }
  }, [profile]);

  const addBranch = () => {
    if (formData.branchInput.trim() && !formData.branches.includes(formData.branchInput.trim())) {
      setFormData({
        ...formData,
        branches: [...formData.branches, formData.branchInput.trim()],
        branchInput: '',
      });
    }
  };

  const removeBranch = (branch: string) => {
    setFormData({
      ...formData,
      branches: formData.branches.filter((b) => b !== branch),
    });
  };

  const addSkill = () => {
    if (formData.skillInput.trim() && !formData.skills.includes(formData.skillInput.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, formData.skillInput.trim()],
        skillInput: '',
      });
    }
  };

  const removeSkill = (skill: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((s) => s !== skill),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile(
      formData.name,
      formData.email,
      parseFloat(formData.cgpa),
      formData.branches,
      formData.skills,
      formData.resumeLink,
      formData.bio
    );
    navigate({ to: '/' });
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!profile) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Profile Not Found</CardTitle>
          <CardDescription>Please create your profile first</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => navigate({ to: '/profile/setup' })}>
            Create Profile
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <ProfileCompletionIndicator profile={profile} />

      <Card>
        <CardHeader>
          <CardTitle>Edit Your Profile</CardTitle>
          <CardDescription>
            Update your information to improve your placement opportunities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="cgpa">CGPA (0-10) *</Label>
              <Input
                id="cgpa"
                type="number"
                step="0.01"
                min="0"
                max="10"
                value={formData.cgpa}
                onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
                required
              />
            </div>

            <div>
              <Label>Branch(es) *</Label>
              <div className="flex gap-2">
                <Input
                  value={formData.branchInput}
                  onChange={(e) => setFormData({ ...formData, branchInput: e.target.value })}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addBranch())}
                  placeholder="e.g., Computer Science"
                />
                <Button type="button" onClick={addBranch}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.branches.map((branch) => (
                  <Badge key={branch} variant="secondary" className="flex items-center gap-1">
                    {branch}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => removeBranch(branch)} />
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <Label>Skills *</Label>
              <div className="flex gap-2">
                <Input
                  value={formData.skillInput}
                  onChange={(e) => setFormData({ ...formData, skillInput: e.target.value })}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  placeholder="e.g., Python, React"
                />
                <Button type="button" onClick={addSkill}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                    {skill}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => removeSkill(skill)} />
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="resumeLink">Resume Link *</Label>
              <Input
                id="resumeLink"
                type="url"
                value={formData.resumeLink}
                onChange={(e) => setFormData({ ...formData, resumeLink: e.target.value })}
                placeholder="https://..."
                required
              />
            </div>

            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={4}
                placeholder="Tell us about yourself..."
              />
            </div>

            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={isUpdating || formData.branches.length === 0 || formData.skills.length === 0}
                className="flex-1"
              >
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate({ to: '/' })}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
