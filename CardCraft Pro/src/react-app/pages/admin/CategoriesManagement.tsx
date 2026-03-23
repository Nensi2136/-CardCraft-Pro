import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import AdminLayout from "@/react-app/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/react-app/components/ui/card";
import { Button } from "@/react-app/components/ui/button";
import { Input } from "@/react-app/components/ui/input";
import { Label } from "@/react-app/components/ui/label";
import { Textarea } from "@/react-app/components/ui/textarea";
import { Plus, Edit, Trash2, ArrowLeft, Save, X } from "lucide-react";
import apiClient from "@/react-app/services/api";

interface Category {
  category_Id: number;
  category_Name: string;
  category_Description: string;
  templateCount: number;
  created_at: string;
  updated_at: string;
}

export default function CategoriesManagement() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: ""
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      
      // Fetch real categories from API Gateway
      const result = await apiClient.cards.getCategories();
      
      if (result.success && result.data) {
        const raw = result.data as unknown;
        const list: unknown[] = Array.isArray(raw)
          ? raw
          : Array.isArray((raw as any)?.data)
            ? (raw as any).data
            : Array.isArray((raw as any)?.categories)
              ? (raw as any).categories
              : [];

        // Use API data directly as it matches the Category interface
        setCategories(list as Category[]);
      } else {
        console.error('Failed to fetch categories:', result.message);
        setCategories([]); // Set empty array on error
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Category name is required";
    }
    
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters long";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      if (editingCategory) {
        // Update existing category via API
        const result = await apiClient.cards.updateCategory(editingCategory.category_Id.toString(), {
          name: formData.name,
          description: formData.description
        });
        
        if (result.success) {
          // Refresh categories list
          await fetchCategories();
          resetForm();
        } else {
          console.error('Update category failed:', result);
          const errorDetails = result.errors?.length ? `\n${result.errors.join('\n')}` : '';
          alert('Failed to update category: ' + (result.message || 'Unknown error') + errorDetails);
        }
      } else {
        // Add new category via API
        const result = await apiClient.cards.createCategory({
          name: formData.name,
          description: formData.description
        });
        
        if (result.success) {
          // Refresh categories list
          await fetchCategories();
          resetForm();
        } else {
          console.error('Create category failed:', result);
          const errorDetails = result.errors?.length ? `\n${result.errors.join('\n')}` : '';
          alert('Failed to create category: ' + (result.message || 'Unknown error') + errorDetails);
        }
      }
    } catch (error) {
      console.error('Failed to save category:', error);
      alert('Failed to save category. Please try again.');
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.category_Name,
      description: category.category_Description
    });
    setShowAddForm(true);
  };

  const handleDelete = async (category: Category) => {
    if (!category.category_Id) {
      alert('Failed to delete category: invalid category id');
      return;
    }

    if ((category.templateCount ?? 0) > 0) {
      alert('This category cannot be deleted because it has templates assigned. Move/delete templates first.');
      return;
    }

    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        // Delete category via API
        const result = await apiClient.cards.deleteCategory(category.category_Id.toString());
        
        if (result.success) {
          // Refresh categories list
          await fetchCategories();
        } else {
          alert('Failed to delete category: ' + (result.message || 'Unknown error'));
        }
      } catch (error) {
        console.error('Failed to delete category:', error);
        alert('Failed to delete category. Please try again.');
      }
    }
  };

  const resetForm = () => {
    setFormData({ name: "", description: "" });
    setEditingCategory(null);
    setShowAddForm(false);
    setErrors({});
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate('/admin/dashboard')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Categories Management</h1>
              <p className="text-muted-foreground mt-1">Manage card template categories</p>
            </div>
          </div>
          <Button onClick={() => setShowAddForm(true)} className="bg-purple-600 hover:bg-purple-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Category
          </Button>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{editingCategory ? 'Edit Category' : 'Add New Category'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Category Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter category name"
                      className={errors.name ? "border-red-500" : ""}
                    />
                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Enter category description (minimum 10 characters)"
                      rows={3}
                      className={errors.description ? "border-red-500" : ""}
                    />
                    {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="bg-green-600 hover:bg-green-700">
                    <Save className="w-4 h-4 mr-2" />
                    {editingCategory ? 'Update Category' : 'Save Category'}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Categories List */}
        <div className="grid gap-6">
          {categories.map((category, index) => (
            <Card key={category.category_Id || `${category.category_Name}-${index}`} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-foreground">{category.category_Name}</h3>
                    </div>
                    <p className="text-muted-foreground mb-3">{category.category_Description}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{category.templateCount} templates</span>
                      <span>Created: {new Date(category.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(category)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(category)}
                      disabled={(category.templateCount ?? 0) > 0}
                      className="text-red-600 hover:text-red-700 hover:border-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {categories.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-muted-foreground">
                <h3 className="text-lg font-medium mb-2">No categories found</h3>
                <p>Get started by adding your first category.</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
