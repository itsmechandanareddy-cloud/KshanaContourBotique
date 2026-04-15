"""
Test suite for Employee and Reports features:
- DELETE /api/employees/{id} - Delete employee
- POST /api/employees/{id}/work - Assign work to employee
- GET /api/reports/orders-by-status - Get orders by status
- GET /api/reports/due-soon - Get due soon orders
- Employee roles: master, tailor, worker
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestEmployeeFeatures:
    """Test employee CRUD and work assignment"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Setup - login and get token"""
        self.session = requests.Session()
        self.session.headers.update({"Content-Type": "application/json"})
        
        # Login as admin
        login_response = self.session.post(f"{BASE_URL}/api/auth/admin/login", json={
            "phone": "9876543210",
            "password": "admin123"
        })
        assert login_response.status_code == 200, f"Login failed: {login_response.text}"
        self.token = login_response.json().get("token")
        self.session.headers.update({"Authorization": f"Bearer {self.token}"})
        yield
    
    def test_get_employees_list(self):
        """Test GET /api/employees returns list"""
        response = self.session.get(f"{BASE_URL}/api/employees")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"Found {len(data)} employees")
    
    def test_create_employee_with_master_role(self):
        """Test creating employee with master role (weekly pay)"""
        employee_data = {
            "name": "TEST_Master_Tailor",
            "phone": "9999888801",
            "email": "master@test.com",
            "role": "master",
            "address": "Test Address",
            "joining_date": "2024-01-15",
            "salary": 5000,
            "documents": []
        }
        response = self.session.post(f"{BASE_URL}/api/employees", json=employee_data)
        assert response.status_code == 200, f"Create failed: {response.text}"
        data = response.json()
        assert "id" in data
        self.master_emp_id = data["id"]
        print(f"Created master employee with ID: {self.master_emp_id}")
        
        # Verify the employee was created with correct role
        get_response = self.session.get(f"{BASE_URL}/api/employees/{self.master_emp_id}")
        assert get_response.status_code == 200
        emp_data = get_response.json()
        assert emp_data["role"] == "master"
        assert emp_data["name"] == "TEST_Master_Tailor"
        print(f"Verified master employee role: {emp_data['role']}")
    
    def test_create_employee_with_tailor_role(self):
        """Test creating employee with tailor role"""
        employee_data = {
            "name": "TEST_Tailor_Worker",
            "phone": "9999888802",
            "role": "tailor",
            "joining_date": "2024-02-01",
            "salary": 15000
        }
        response = self.session.post(f"{BASE_URL}/api/employees", json=employee_data)
        assert response.status_code == 200
        data = response.json()
        self.tailor_emp_id = data["id"]
        print(f"Created tailor employee with ID: {self.tailor_emp_id}")
    
    def test_create_employee_with_worker_role(self):
        """Test creating employee with worker role"""
        employee_data = {
            "name": "TEST_Worker",
            "phone": "9999888803",
            "role": "worker",
            "joining_date": "2024-03-01",
            "salary": 10000
        }
        response = self.session.post(f"{BASE_URL}/api/employees", json=employee_data)
        assert response.status_code == 200
        data = response.json()
        self.worker_emp_id = data["id"]
        print(f"Created worker employee with ID: {self.worker_emp_id}")
    
    def test_delete_employee_endpoint_exists(self):
        """Test DELETE /api/employees/{id} endpoint exists and works"""
        # First create an employee to delete
        employee_data = {
            "name": "TEST_ToDelete",
            "phone": "9999888899",
            "role": "worker",
            "joining_date": "2024-01-01",
            "salary": 8000
        }
        create_response = self.session.post(f"{BASE_URL}/api/employees", json=employee_data)
        assert create_response.status_code == 200
        emp_id = create_response.json()["id"]
        print(f"Created employee to delete: {emp_id}")
        
        # Now delete the employee
        delete_response = self.session.delete(f"{BASE_URL}/api/employees/{emp_id}")
        assert delete_response.status_code == 200, f"Delete failed: {delete_response.text}"
        data = delete_response.json()
        assert "message" in data
        print(f"Delete response: {data}")
        
        # Verify employee is deleted
        get_response = self.session.get(f"{BASE_URL}/api/employees/{emp_id}")
        assert get_response.status_code == 404, "Employee should not exist after deletion"
        print("Verified employee was deleted")
    
    def test_assign_work_to_employee(self):
        """Test POST /api/employees/{id}/work - assign work"""
        # First create an employee
        employee_data = {
            "name": "TEST_WorkAssign",
            "phone": "9999888877",
            "role": "tailor",
            "joining_date": "2024-01-01",
            "salary": 12000
        }
        create_response = self.session.post(f"{BASE_URL}/api/employees", json=employee_data)
        assert create_response.status_code == 200
        emp_id = create_response.json()["id"]
        
        # Get an existing order
        orders_response = self.session.get(f"{BASE_URL}/api/orders")
        assert orders_response.status_code == 200
        orders = orders_response.json()
        
        if len(orders) > 0:
            order_id = orders[0]["order_id"]
            
            # Assign work
            work_data = {
                "employee_id": emp_id,
                "order_id": order_id,
                "item_index": 0,
                "date": "2024-01-20",
                "hours": 4.5,
                "notes": "Stitching blouse"
            }
            work_response = self.session.post(f"{BASE_URL}/api/employees/{emp_id}/work", json=work_data)
            assert work_response.status_code == 200, f"Work assignment failed: {work_response.text}"
            data = work_response.json()
            assert "message" in data
            print(f"Work assigned: {data}")
            
            # Verify work was assigned
            get_emp_response = self.session.get(f"{BASE_URL}/api/employees/{emp_id}")
            assert get_emp_response.status_code == 200
            emp_data = get_emp_response.json()
            assert "work_assignments" in emp_data or "hours_log" in emp_data
            print(f"Employee work assignments verified")
        else:
            pytest.skip("No orders available for work assignment test")
        
        # Cleanup
        self.session.delete(f"{BASE_URL}/api/employees/{emp_id}")


class TestReportsFeatures:
    """Test reports endpoints"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Setup - login and get token"""
        self.session = requests.Session()
        self.session.headers.update({"Content-Type": "application/json"})
        
        # Login as admin
        login_response = self.session.post(f"{BASE_URL}/api/auth/admin/login", json={
            "phone": "9876543210",
            "password": "admin123"
        })
        assert login_response.status_code == 200
        self.token = login_response.json().get("token")
        self.session.headers.update({"Authorization": f"Bearer {self.token}"})
        yield
    
    def test_get_orders_by_status_pending(self):
        """Test GET /api/reports/orders-by-status?status=pending"""
        response = self.session.get(f"{BASE_URL}/api/reports/orders-by-status?status=pending")
        assert response.status_code == 200, f"Failed: {response.text}"
        data = response.json()
        assert isinstance(data, list)
        print(f"Found {len(data)} pending orders")
        
        # Verify all returned orders have pending status
        for order in data:
            assert order.get("status") == "pending", f"Order {order.get('order_id')} has wrong status"
    
    def test_get_orders_by_status_in_progress(self):
        """Test GET /api/reports/orders-by-status?status=in_progress"""
        response = self.session.get(f"{BASE_URL}/api/reports/orders-by-status?status=in_progress")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"Found {len(data)} in_progress orders")
    
    def test_get_orders_by_status_ready(self):
        """Test GET /api/reports/orders-by-status?status=ready"""
        response = self.session.get(f"{BASE_URL}/api/reports/orders-by-status?status=ready")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"Found {len(data)} ready orders")
    
    def test_get_due_soon_orders(self):
        """Test GET /api/reports/due-soon"""
        response = self.session.get(f"{BASE_URL}/api/reports/due-soon")
        assert response.status_code == 200, f"Failed: {response.text}"
        data = response.json()
        assert isinstance(data, list)
        print(f"Found {len(data)} due soon orders")
        
        # Verify due soon orders have days_until field
        for order in data:
            assert "days_until" in order, f"Order {order.get('order_id')} missing days_until"
            assert order["days_until"] <= 2, f"Order {order.get('order_id')} has days_until > 2"
    
    def test_financial_summary_no_net_summary_required(self):
        """Test GET /api/reports/financial-summary returns data (net_summary still in API but removed from UI)"""
        response = self.session.get(f"{BASE_URL}/api/reports/financial-summary")
        assert response.status_code == 200
        data = response.json()
        
        # Verify structure
        assert "orders" in data
        assert "pending" in data
        assert "employees" in data
        assert "materials" in data
        # net_summary is still in API response but UI doesn't show it
        print(f"Financial summary retrieved successfully")
    
    def test_dashboard_stats(self):
        """Test GET /api/dashboard/stats"""
        response = self.session.get(f"{BASE_URL}/api/dashboard/stats")
        assert response.status_code == 200
        data = response.json()
        
        # Verify expected fields
        assert "pending_delivery" in data
        assert "in_progress" in data
        assert "ready_to_deliver" in data
        assert "due_soon_count" in data
        print(f"Dashboard stats: pending={data['pending_delivery']}, in_progress={data['in_progress']}, ready={data['ready_to_deliver']}, due_soon={data['due_soon_count']}")


class TestCleanup:
    """Cleanup test employees"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        self.session = requests.Session()
        self.session.headers.update({"Content-Type": "application/json"})
        login_response = self.session.post(f"{BASE_URL}/api/auth/admin/login", json={
            "phone": "9876543210",
            "password": "admin123"
        })
        self.token = login_response.json().get("token")
        self.session.headers.update({"Authorization": f"Bearer {self.token}"})
        yield
    
    def test_cleanup_test_employees(self):
        """Clean up TEST_ prefixed employees"""
        response = self.session.get(f"{BASE_URL}/api/employees")
        if response.status_code == 200:
            employees = response.json()
            for emp in employees:
                if emp.get("name", "").startswith("TEST_"):
                    delete_response = self.session.delete(f"{BASE_URL}/api/employees/{emp['id']}")
                    print(f"Deleted test employee: {emp['name']} - {delete_response.status_code}")
