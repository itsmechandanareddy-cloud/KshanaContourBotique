import { useState, useEffect } from "react";
import axios from "axios";
import { API } from "../../App";
import AdminLayout from "../../components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../components/ui/dialog";
import { Plus, Trash2, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

const Gallery = () => {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  
  const [newItem, setNewItem] = useState({
    title: "", description: "", image_url: "", category: ""
  });

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const response = await axios.get(`${API}/gallery`);
      setGallery(response.data);
    } catch (error) {
      toast.error("Failed to load gallery");
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async () => {
    if (!newItem.title || !newItem.image_url) {
      toast.error("Please fill title and image URL");
      return;
    }
    
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${API}/gallery`, newItem, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Image added to gallery");
      setShowAddModal(false);
      setNewItem({ title: "", description: "", image_url: "", category: "" });
      fetchGallery();
    } catch (error) {
      toast.error("Failed to add image");
    }
  };

  const handleDeleteItem = async (id) => {
    if (!window.confirm("Delete this image from gallery?")) return;
    
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API}/gallery/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Image deleted");
      fetchGallery();
    } catch (error) {
      toast.error("Failed to delete image");
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#C05C3B] border-t-transparent"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in" data-testid="admin-gallery">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="font-['Cormorant_Garamond'] text-4xl font-medium text-[#2D2420]">
            Gallery
          </h1>
          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-[#C05C3B] hover:bg-[#A84C2F] text-white rounded-full px-6"
            data-testid="add-gallery-button"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Image
          </Button>
        </div>

        <p className="text-[#8A7D76]">
          Manage gallery images that appear on the public landing page.
        </p>

        {/* Gallery Grid */}
        {gallery.length === 0 ? (
          <Card className="bg-white border-[#EFEBE4]">
            <CardContent className="p-12 text-center">
              <ImageIcon className="w-12 h-12 mx-auto text-[#8A7D76] mb-4" />
              <p className="text-[#8A7D76]">No gallery images yet</p>
              <p className="text-sm text-[#8A7D76]">Add images to showcase your work</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {gallery.map((item) => (
              <div key={item.id} className="group relative aspect-square overflow-hidden rounded-2xl bg-[#F7F2EB]">
                <img 
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x400?text=Image+Not+Found';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2D2420]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-white font-medium truncate">{item.title}</p>
                    {item.category && (
                      <p className="text-white/70 text-sm">{item.category}</p>
                    )}
                  </div>
                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => handleDeleteItem(item.id)}
                    className="absolute top-4 right-4 bg-[#B85450]/90 hover:bg-[#B85450] rounded-full"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Image Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="bg-[#FDFBF7] border-[#EFEBE4]">
          <DialogHeader>
            <DialogTitle className="font-['Cormorant_Garamond'] text-xl text-[#2D2420]">
              Add Gallery Image
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-[#5C504A]">Title *</Label>
              <Input
                value={newItem.title}
                onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                className="bg-[#F7F2EB] border-transparent rounded-xl"
                placeholder="e.g., Bridal Collection"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[#5C504A]">Image URL *</Label>
              <Input
                value={newItem.image_url}
                onChange={(e) => setNewItem({ ...newItem, image_url: e.target.value })}
                className="bg-[#F7F2EB] border-transparent rounded-xl"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[#5C504A]">Category</Label>
              <Input
                value={newItem.category}
                onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                className="bg-[#F7F2EB] border-transparent rounded-xl"
                placeholder="e.g., Blouses, Sarees"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[#5C504A]">Description</Label>
              <Input
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                className="bg-[#F7F2EB] border-transparent rounded-xl"
              />
            </div>
            {newItem.image_url && (
              <div className="space-y-2">
                <Label className="text-[#5C504A]">Preview</Label>
                <div className="aspect-video rounded-xl overflow-hidden bg-[#F7F2EB]">
                  <img 
                    src={newItem.image_url}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x300?text=Invalid+URL';
                    }}
                  />
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddModal(false)} className="rounded-full">
              Cancel
            </Button>
            <Button onClick={handleAddItem} className="bg-[#C05C3B] hover:bg-[#A84C2F] text-white rounded-full">
              Add Image
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default Gallery;
