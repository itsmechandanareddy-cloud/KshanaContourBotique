"""
Test Partnership CRUD and Materials Edit/Delete APIs
Tests for iteration 5 features:
- Partnership entries CRUD (GET, POST, PUT, DELETE)
- Materials edit (PUT) and delete (DELETE)
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestPartnershipCRUD:
    """Partnership entries CRUD tests"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Login and get auth token"""
        self.session = requests.Session()
        login_response = self.session.post(f"{BASE_URL}/api/auth/admin/login", json={
            "phone": "9876543210",
            "password": "admin123"
        })
        assert login_response.status_code == 200, f"Login failed: {login_response.text}"
        self.token = login_response.json().get("token")
        self.headers = {"Authorization": f"Bearer {self.token}"}
        yield
        # Cleanup: delete any TEST_ entries created
        try:
            entries = self.session.get(f"{BASE_URL}/api/partnership/entries", headers=self.headers).json()
            for entry in entries:
                if entry.get("reason", "").startswith("TEST_"):
                    self.session.delete(f"{BASE_URL}/api/partnership/entries/{entry['id']}", headers=self.headers)
        except:
            pass
    
    def test_get_partnership_entries_all(self):
        """GET /api/partnership/entries returns all entries"""
        response = self.session.get(f"{BASE_URL}/api/partnership/entries", headers=self.headers)
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ GET /api/partnership/entries returned {len(data)} entries")
    
    def test_get_partnership_entries_by_partner_chandana(self):
        """GET /api/partnership/entries?partner=chandana returns Chandana entries"""
        response = self.session.get(f"{BASE_URL}/api/partnership/entries?partner=chandana", headers=self.headers)
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        # All entries should have chandana > 0
        for entry in data:
            assert entry.get("chandana", 0) > 0, f"Entry {entry.get('id')} has chandana=0"
        print(f"✓ GET /api/partnership/entries?partner=chandana returned {len(data)} entries")
    
    def test_get_partnership_entries_by_partner_akanksha(self):
        """GET /api/partnership/entries?partner=akanksha returns Akanksha entries"""
        response = self.session.get(f"{BASE_URL}/api/partnership/entries?partner=akanksha", headers=self.headers)
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        for entry in data:
            assert entry.get("akanksha", 0) > 0
        print(f"✓ GET /api/partnership/entries?partner=akanksha returned {len(data)} entries")
    
    def test_get_partnership_entries_by_partner_sbi(self):
        """GET /api/partnership/entries?partner=sbi returns SBI/Kshana entries"""
        response = self.session.get(f"{BASE_URL}/api/partnership/entries?partner=sbi", headers=self.headers)
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        for entry in data:
            assert entry.get("sbi", 0) > 0
        print(f"✓ GET /api/partnership/entries?partner=sbi returned {len(data)} entries")
    
    def test_create_partnership_entry(self):
        """POST /api/partnership/entries creates new entry"""
        payload = {
            "date": "2026-01-15",
            "order": "NA",
            "reason": "TEST_Shop supplies",
            "paid_to": "Vendor ABC",
            "chandana": 5000,
            "akanksha": 0,
            "sbi": 0,
            "mode": "UPI",
            "comments": "Test entry"
        }
        response = self.session.post(f"{BASE_URL}/api/partnership/entries", json=payload, headers=self.headers)
        assert response.status_code == 200
        data = response.json()
        assert "id" in data
        assert data.get("message") == "Entry added"
        
        # Verify entry was created
        entry_id = data["id"]
        entries = self.session.get(f"{BASE_URL}/api/partnership/entries?partner=chandana", headers=self.headers).json()
        found = any(e.get("id") == entry_id for e in entries)
        assert found, "Created entry not found in list"
        print(f"✓ POST /api/partnership/entries created entry {entry_id}")
        
        # Cleanup
        self.session.delete(f"{BASE_URL}/api/partnership/entries/{entry_id}", headers=self.headers)
    
    def test_update_partnership_entry(self):
        """PUT /api/partnership/entries/{id} updates entry"""
        # First create an entry
        create_payload = {
            "date": "2026-01-15",
            "reason": "TEST_Original reason",
            "paid_to": "Original vendor",
            "chandana": 1000,
            "akanksha": 0,
            "sbi": 0,
            "mode": "Cash"
        }
        create_response = self.session.post(f"{BASE_URL}/api/partnership/entries", json=create_payload, headers=self.headers)
        assert create_response.status_code == 200
        entry_id = create_response.json()["id"]
        
        # Update the entry
        update_payload = {
            "date": "2026-01-16",
            "reason": "TEST_Updated reason",
            "paid_to": "Updated vendor",
            "chandana": 2000,
            "akanksha": 500,
            "sbi": 0,
            "mode": "UPI"
        }
        update_response = self.session.put(f"{BASE_URL}/api/partnership/entries/{entry_id}", json=update_payload, headers=self.headers)
        assert update_response.status_code == 200
        assert update_response.json().get("message") == "Entry updated"
        
        # Verify update
        entries = self.session.get(f"{BASE_URL}/api/partnership/entries", headers=self.headers).json()
        updated_entry = next((e for e in entries if e.get("id") == entry_id), None)
        assert updated_entry is not None
        assert updated_entry.get("reason") == "TEST_Updated reason"
        assert updated_entry.get("chandana") == 2000
        assert updated_entry.get("akanksha") == 500
        print(f"✓ PUT /api/partnership/entries/{entry_id} updated successfully")
        
        # Cleanup
        self.session.delete(f"{BASE_URL}/api/partnership/entries/{entry_id}", headers=self.headers)
    
    def test_delete_partnership_entry(self):
        """DELETE /api/partnership/entries/{id} deletes entry"""
        # First create an entry
        create_payload = {
            "date": "2026-01-15",
            "reason": "TEST_To be deleted",
            "paid_to": "Test vendor",
            "chandana": 100,
            "akanksha": 0,
            "sbi": 0,
            "mode": "Cash"
        }
        create_response = self.session.post(f"{BASE_URL}/api/partnership/entries", json=create_payload, headers=self.headers)
        assert create_response.status_code == 200
        entry_id = create_response.json()["id"]
        
        # Delete the entry
        delete_response = self.session.delete(f"{BASE_URL}/api/partnership/entries/{entry_id}", headers=self.headers)
        assert delete_response.status_code == 200
        assert delete_response.json().get("message") == "Entry deleted"
        
        # Verify deletion
        entries = self.session.get(f"{BASE_URL}/api/partnership/entries", headers=self.headers).json()
        found = any(e.get("id") == entry_id for e in entries)
        assert not found, "Deleted entry still exists"
        print(f"✓ DELETE /api/partnership/entries/{entry_id} deleted successfully")
    
    def test_delete_nonexistent_entry_returns_404(self):
        """DELETE /api/partnership/entries/{invalid_id} returns 404"""
        response = self.session.delete(f"{BASE_URL}/api/partnership/entries/000000000000000000000000", headers=self.headers)
        assert response.status_code == 404
        print("✓ DELETE nonexistent entry returns 404")


class TestMaterialsEditDelete:
    """Materials edit and delete tests"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Login and get auth token"""
        self.session = requests.Session()
        login_response = self.session.post(f"{BASE_URL}/api/auth/admin/login", json={
            "phone": "9876543210",
            "password": "admin123"
        })
        assert login_response.status_code == 200
        self.token = login_response.json().get("token")
        self.headers = {"Authorization": f"Bearer {self.token}"}
        yield
        # Cleanup: delete any TEST_ materials created
        try:
            materials = self.session.get(f"{BASE_URL}/api/materials", headers=self.headers).json()
            for mat in materials:
                if mat.get("name", "").startswith("TEST_"):
                    self.session.delete(f"{BASE_URL}/api/materials/{mat['id']}", headers=self.headers)
        except:
            pass
    
    def test_get_materials(self):
        """GET /api/materials returns list of materials"""
        response = self.session.get(f"{BASE_URL}/api/materials", headers=self.headers)
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ GET /api/materials returned {len(data)} materials")
    
    def test_create_material(self):
        """POST /api/materials creates new material"""
        payload = {
            "name": "TEST_Silk Fabric",
            "description": "Premium silk for blouses",
            "quantity": 10,
            "unit": "meters",
            "cost": 5000,
            "purchase_date": "2026-01-15",
            "payment_mode": "upi",
            "supplier": "Fabric House"
        }
        response = self.session.post(f"{BASE_URL}/api/materials", json=payload, headers=self.headers)
        assert response.status_code == 200
        data = response.json()
        assert "id" in data
        print(f"✓ POST /api/materials created material {data['id']}")
        
        # Cleanup
        self.session.delete(f"{BASE_URL}/api/materials/{data['id']}", headers=self.headers)
    
    def test_update_material(self):
        """PUT /api/materials/{id} updates material"""
        # First create a material
        create_payload = {
            "name": "TEST_Cotton Fabric",
            "description": "Original description",
            "quantity": 5,
            "unit": "meters",
            "cost": 1000,
            "purchase_date": "2026-01-15",
            "payment_mode": "cash",
            "supplier": "Original Supplier"
        }
        create_response = self.session.post(f"{BASE_URL}/api/materials", json=create_payload, headers=self.headers)
        assert create_response.status_code == 200
        material_id = create_response.json()["id"]
        
        # Update the material
        update_payload = {
            "name": "TEST_Cotton Fabric Updated",
            "description": "Updated description",
            "quantity": 15,
            "unit": "yards",
            "cost": 2500,
            "purchase_date": "2026-01-16",
            "payment_mode": "upi",
            "supplier": "New Supplier"
        }
        update_response = self.session.put(f"{BASE_URL}/api/materials/{material_id}", json=update_payload, headers=self.headers)
        assert update_response.status_code == 200
        assert update_response.json().get("message") == "Material updated"
        
        # Verify update
        materials = self.session.get(f"{BASE_URL}/api/materials", headers=self.headers).json()
        updated_mat = next((m for m in materials if m.get("id") == material_id), None)
        assert updated_mat is not None
        assert updated_mat.get("name") == "TEST_Cotton Fabric Updated"
        assert updated_mat.get("quantity") == 15
        assert updated_mat.get("cost") == 2500
        assert updated_mat.get("supplier") == "New Supplier"
        print(f"✓ PUT /api/materials/{material_id} updated successfully")
        
        # Cleanup
        self.session.delete(f"{BASE_URL}/api/materials/{material_id}", headers=self.headers)
    
    def test_delete_material(self):
        """DELETE /api/materials/{id} deletes material"""
        # First create a material
        create_payload = {
            "name": "TEST_To Delete Material",
            "description": "Will be deleted",
            "quantity": 1,
            "unit": "pieces",
            "cost": 100,
            "purchase_date": "2026-01-15",
            "payment_mode": "cash",
            "supplier": "Test"
        }
        create_response = self.session.post(f"{BASE_URL}/api/materials", json=create_payload, headers=self.headers)
        assert create_response.status_code == 200
        material_id = create_response.json()["id"]
        
        # Delete the material
        delete_response = self.session.delete(f"{BASE_URL}/api/materials/{material_id}", headers=self.headers)
        assert delete_response.status_code == 200
        assert delete_response.json().get("message") == "Material deleted"
        
        # Verify deletion
        materials = self.session.get(f"{BASE_URL}/api/materials", headers=self.headers).json()
        found = any(m.get("id") == material_id for m in materials)
        assert not found, "Deleted material still exists"
        print(f"✓ DELETE /api/materials/{material_id} deleted successfully")
    
    def test_delete_nonexistent_material_returns_404(self):
        """DELETE /api/materials/{invalid_id} returns 404"""
        response = self.session.delete(f"{BASE_URL}/api/materials/000000000000000000000000", headers=self.headers)
        assert response.status_code == 404
        print("✓ DELETE nonexistent material returns 404")
    
    def test_update_nonexistent_material_returns_404(self):
        """PUT /api/materials/{invalid_id} returns 404"""
        payload = {
            "name": "Test",
            "description": "",
            "quantity": 1,
            "unit": "pieces",
            "cost": 100,
            "purchase_date": "2026-01-15",
            "payment_mode": "cash",
            "supplier": ""
        }
        response = self.session.put(f"{BASE_URL}/api/materials/000000000000000000000000", json=payload, headers=self.headers)
        assert response.status_code == 404
        print("✓ PUT nonexistent material returns 404")


class TestPartnershipReport:
    """Partnership report endpoint tests"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Login and get auth token"""
        self.session = requests.Session()
        login_response = self.session.post(f"{BASE_URL}/api/auth/admin/login", json={
            "phone": "9876543210",
            "password": "admin123"
        })
        assert login_response.status_code == 200
        self.token = login_response.json().get("token")
        self.headers = {"Authorization": f"Bearer {self.token}"}
    
    def test_get_partnership_report(self):
        """GET /api/reports/partnership returns partnership summary"""
        response = self.session.get(f"{BASE_URL}/api/reports/partnership", headers=self.headers)
        assert response.status_code == 200
        data = response.json()
        
        # Verify structure
        assert "chandana" in data
        assert "akanksha" in data
        assert "kshana_account" in data
        assert "summary" in data
        assert "monthly" in data
        
        # Verify chandana structure
        assert "total_invested" in data["chandana"]
        assert "entries" in data["chandana"]
        
        # Verify akanksha structure
        assert "total_invested" in data["akanksha"]
        assert "entries" in data["akanksha"]
        
        # Verify kshana_account structure
        assert "total_income" in data["kshana_account"]
        assert "total_sbi_outgoing" in data["kshana_account"]
        assert "balance" in data["kshana_account"]
        
        print(f"✓ GET /api/reports/partnership returned valid structure")
        print(f"  Chandana invested: {data['chandana']['total_invested']}")
        print(f"  Akanksha invested: {data['akanksha']['total_invested']}")
        print(f"  Kshana balance: {data['kshana_account']['balance']}")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
