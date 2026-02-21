import { useState } from 'react';
import { useGetCompanies, useGetJobPostings, useAddJobPosting } from '../../hooks/useAdminOperations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Briefcase, X } from 'lucide-react';

export function JobPostingManagement() {
  const { data: companies = [] } = useGetCompanies();
  const { data: jobs = [], isLoading } = useGetJobPostings();
  const { addJobPosting, isAdding } = useAddJobPosting();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    companyId: '',
    title: '',
    description: '',
    requiredSkills: [] as string[],
    skillInput: '',
    minCGPA: '',
    eligibleBranches: [] as string[],
    branchInput: '',
    salaryMin: '',
    salaryMax: '',
    logoUrl: '',
  });

  const addSkill = () => {
    if (formData.skillInput.trim()) {
      setFormData({
        ...formData,
        requiredSkills: [...formData.requiredSkills, formData.skillInput.trim()],
        skillInput: '',
      });
    }
  };

  const removeSkill = (skill: string) => {
    setFormData({
      ...formData,
      requiredSkills: formData.requiredSkills.filter((s) => s !== skill),
    });
  };

  const addBranch = () => {
    if (formData.branchInput.trim()) {
      setFormData({
        ...formData,
        eligibleBranches: [...formData.eligibleBranches, formData.branchInput.trim()],
        branchInput: '',
      });
    }
  };

  const removeBranch = (branch: string) => {
    setFormData({
      ...formData,
      eligibleBranches: formData.eligibleBranches.filter((b) => b !== branch),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addJobPosting(
      BigInt(formData.companyId),
      formData.title,
      formData.description,
      formData.requiredSkills,
      parseFloat(formData.minCGPA),
      formData.eligibleBranches,
      [BigInt(formData.salaryMin), BigInt(formData.salaryMax)],
      formData.logoUrl || null
    );
    setFormData({
      companyId: '',
      title: '',
      description: '',
      requiredSkills: [],
      skillInput: '',
      minCGPA: '',
      eligibleBranches: [],
      branchInput: '',
      salaryMin: '',
      salaryMax: '',
      logoUrl: '',
    });
    setOpen(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              Job Posting Management
            </CardTitle>
            <CardDescription>Create and manage job postings</CardDescription>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Job Posting
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Job Posting</DialogTitle>
                <DialogDescription>Enter the job details below</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="company">Company</Label>
                  <Select value={formData.companyId} onValueChange={(value) => setFormData({ ...formData, companyId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select company" />
                    </SelectTrigger>
                    <SelectContent>
                      {companies.map((company) => (
                        <SelectItem key={company.id.toString()} value={company.id.toString()}>
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="title">Job Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    required
                  />
                </div>
                <div>
                  <Label>Required Skills</Label>
                  <div className="flex gap-2">
                    <Input
                      value={formData.skillInput}
                      onChange={(e) => setFormData({ ...formData, skillInput: e.target.value })}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                      placeholder="Add skill"
                    />
                    <Button type="button" onClick={addSkill}>Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.requiredSkills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                        {skill}
                        <X className="w-3 h-3 cursor-pointer" onClick={() => removeSkill(skill)} />
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <Label htmlFor="minCGPA">Minimum CGPA</Label>
                  <Input
                    id="minCGPA"
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    value={formData.minCGPA}
                    onChange={(e) => setFormData({ ...formData, minCGPA: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label>Eligible Branches</Label>
                  <div className="flex gap-2">
                    <Input
                      value={formData.branchInput}
                      onChange={(e) => setFormData({ ...formData, branchInput: e.target.value })}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addBranch())}
                      placeholder="Add branch (e.g., CSE, ECE)"
                    />
                    <Button type="button" onClick={addBranch}>Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.eligibleBranches.map((branch) => (
                      <Badge key={branch} variant="secondary" className="flex items-center gap-1">
                        {branch}
                        <X className="w-3 h-3 cursor-pointer" onClick={() => removeBranch(branch)} />
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="salaryMin">Minimum Salary (₹)</Label>
                    <Input
                      id="salaryMin"
                      type="number"
                      value={formData.salaryMin}
                      onChange={(e) => setFormData({ ...formData, salaryMin: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="salaryMax">Maximum Salary (₹)</Label>
                    <Input
                      id="salaryMax"
                      type="number"
                      value={formData.salaryMax}
                      onChange={(e) => setFormData({ ...formData, salaryMax: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="logoUrl">Logo URL (optional)</Label>
                  <Input
                    id="logoUrl"
                    type="url"
                    value={formData.logoUrl}
                    onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                  />
                </div>
                <Button type="submit" disabled={isAdding} className="w-full">
                  {isAdding ? 'Adding...' : 'Add Job Posting'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No job postings yet</p>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => {
              const company = companies.find((c) => c.id === job.companyId);
              return (
                <Card key={job.id.toString()}>
                  <CardHeader>
                    <CardTitle className="text-lg">{job.title}</CardTitle>
                    <CardDescription>{company?.name}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <p><span className="font-medium">Min CGPA:</span> {job.minCGPA.toFixed(2)}</p>
                      <p><span className="font-medium">Branches:</span> {job.eligibleBranches.join(', ')}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
