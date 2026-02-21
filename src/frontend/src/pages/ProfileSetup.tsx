import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useStudentProfile } from '../hooks/useStudentProfile';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

export function ProfileSetup() {
  const navigate = useNavigate();
  const { createProfile, isCreating } = useStudentProfile();
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
    await createProfile(
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

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Create Your Profile</CardTitle>
          <CardDescription>
            Complete your profile to start applying for placements
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

            <Button
              type="submit"
              disabled={isCreating || formData.branches.length === 0 || formData.skills.length === 0}
              className="w-full"
            >
              {isCreating ? 'Creating Profile...' : 'Create Profile'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
