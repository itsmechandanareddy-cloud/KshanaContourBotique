import requests
import sys
import json
from datetime import datetime, timedelta

class KshanaContourAPITester:
    def __init__(self, base_url="https://boutique-mgmt-1.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.admin_token = None
        self.customer_token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.created_order_id = None
        self.created_customer_id = None
        self.created_employee_id = None
        self.created_material_id = None
        self.created_gallery_id = None

    def log_test(self, name, success, details=""):
        """Log test results"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name} - PASSED")
        else:
            print(f"❌ {name} - FAILED: {details}")

    def make_request(self, method, endpoint, data=None, token=None, expected_status=200):
        """Make HTTP request with error handling"""
        url = f"{self.api_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        
        if token:
            headers['Authorization'] = f'Bearer {token}'

        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, timeout=10)

            success = response.status_code == expected_status
            return success, response.json() if success else response.text, response.status_code

        except Exception as e:
            return False, str(e), 0

    def test_root_endpoint(self):
        """Test API root endpoint"""
        success, response, status = self.make_request('GET', '')
        self.log_test("API Root Endpoint", success and "Kshana Contour" in str(response))
        return success

    def test_admin_login(self):
        """Test admin login"""
        data = {
            "phone": "9876543210",
            "password": "admin123"
        }
        success, response, status = self.make_request('POST', 'auth/admin/login', data)
        
        if success and 'token' in response:
            self.admin_token = response['token']
            self.log_test("Admin Login", True)
            return True
        else:
            self.log_test("Admin Login", False, f"Status: {status}, Response: {response}")
            return False

    def test_admin_me(self):
        """Test admin /me endpoint"""
        if not self.admin_token:
            self.log_test("Admin Me Endpoint", False, "No admin token")
            return False
            
        success, response, status = self.make_request('GET', 'auth/me', token=self.admin_token)
        self.log_test("Admin Me Endpoint", success and response.get('role') == 'admin')
        return success

    def test_create_order(self):
        """Test order creation"""
        if not self.admin_token:
            self.log_test("Create Order", False, "No admin token")
            return False

        tomorrow = (datetime.now() + timedelta(days=1)).strftime('%Y-%m-%d')
        data = {
            "customer_name": "Test Customer",
            "customer_phone": "9999999999",
            "customer_email": "test@example.com",
            "customer_age": 25,
            "customer_gender": "female",
            "customer_dob": "1999-01-01",
            "delivery_date": tomorrow,
            "items": [
                {
                    "service_type": "Bridal blouses",
                    "blouse_type": "with_cups",
                    "front_neck_design": "Round neck",
                    "back_neck_design": "Deep back",
                    "chest": "36",
                    "waist": "32",
                    "hip": "38",
                    "shoulder": "14",
                    "sleeve_length": "12",
                    "sleeve_round": "11",
                    "armhole": "18",
                    "length": "15",
                    "neck_depth_front": "6",
                    "neck_depth_back": "8",
                    "additional_notes": "Test blouse",
                    "cost": 2500
                }
            ],
            "tax_percentage": 18,
            "advance_amount": 1000,
            "advance_date": datetime.now().strftime('%Y-%m-%d'),
            "advance_mode": "cash",
            "description": "Test order for API testing"
        }
        
        success, response, status = self.make_request('POST', 'orders', data, self.admin_token, 200)
        
        if success and 'order_id' in response:
            self.created_order_id = response['order_id']
            self.log_test("Create Order", True)
            return True
        else:
            self.log_test("Create Order", False, f"Status: {status}, Response: {response}")
            return False

    def test_get_orders(self):
        """Test get orders"""
        if not self.admin_token:
            self.log_test("Get Orders", False, "No admin token")
            return False
            
        success, response, status = self.make_request('GET', 'orders', token=self.admin_token)
        self.log_test("Get Orders", success and isinstance(response, list))
        return success

    def test_get_order_detail(self):
        """Test get specific order"""
        if not self.admin_token or not self.created_order_id:
            self.log_test("Get Order Detail", False, "No admin token or order ID")
            return False
            
        success, response, status = self.make_request('GET', f'orders/{self.created_order_id}', token=self.admin_token)
        self.log_test("Get Order Detail", success and response.get('order_id') == self.created_order_id)
        return success

    def test_update_order_status(self):
        """Test update order status"""
        if not self.admin_token or not self.created_order_id:
            self.log_test("Update Order Status", False, "No admin token or order ID")
            return False
            
        success, response, status = self.make_request('PUT', f'orders/{self.created_order_id}/status?status=in_progress', token=self.admin_token)
        self.log_test("Update Order Status", success)
        return success

    def test_add_payment(self):
        """Test add payment to order"""
        if not self.admin_token or not self.created_order_id:
            self.log_test("Add Payment", False, "No admin token or order ID")
            return False

        data = {
            "amount": 500,
            "date": datetime.now().strftime('%Y-%m-%d'),
            "mode": "upi",
            "notes": "Test payment"
        }
        
        success, response, status = self.make_request('POST', f'orders/{self.created_order_id}/payment', data, self.admin_token)
        self.log_test("Add Payment", success)
        return success

    def test_customer_login(self):
        """Test customer login with created customer"""
        data = {
            "phone": "9999999999",
            "dob": "1999-01-01"
        }
        success, response, status = self.make_request('POST', 'auth/customer/login', data)
        
        if success and 'token' in response:
            self.customer_token = response['token']
            self.created_customer_id = response['id']
            self.log_test("Customer Login", True)
            return True
        else:
            self.log_test("Customer Login", False, f"Status: {status}, Response: {response}")
            return False

    def test_customer_orders(self):
        """Test customer viewing their orders"""
        if not self.customer_token:
            self.log_test("Customer Orders", False, "No customer token")
            return False
            
        success, response, status = self.make_request('GET', 'orders', token=self.customer_token)
        self.log_test("Customer Orders", success and isinstance(response, list))
        return success

    def test_create_employee(self):
        """Test employee creation"""
        if not self.admin_token:
            self.log_test("Create Employee", False, "No admin token")
            return False

        data = {
            "name": "Test Employee",
            "phone": "8888888888",
            "email": "employee@test.com",
            "role": "Tailor",
            "address": "Test Address",
            "joining_date": datetime.now().strftime('%Y-%m-%d'),
            "salary": 25000,
            "documents": ["Aadhar", "PAN"]
        }
        
        success, response, status = self.make_request('POST', 'employees', data, self.admin_token, 200)
        
        if success and 'id' in response:
            self.created_employee_id = response['id']
            self.log_test("Create Employee", True)
            return True
        else:
            self.log_test("Create Employee", False, f"Status: {status}, Response: {response}")
            return False

    def test_get_employees(self):
        """Test get employees"""
        if not self.admin_token:
            self.log_test("Get Employees", False, "No admin token")
            return False
            
        success, response, status = self.make_request('GET', 'employees', token=self.admin_token)
        self.log_test("Get Employees", success and isinstance(response, list))
        return success

    def test_create_material(self):
        """Test material creation"""
        if not self.admin_token:
            self.log_test("Create Material", False, "No admin token")
            return False

        data = {
            "name": "Test Fabric",
            "description": "High quality silk fabric",
            "quantity": 10,
            "unit": "meters",
            "cost": 500,
            "purchase_date": datetime.now().strftime('%Y-%m-%d'),
            "payment_mode": "cash",
            "supplier": "Test Supplier"
        }
        
        success, response, status = self.make_request('POST', 'materials', data, self.admin_token, 200)
        
        if success and 'id' in response:
            self.created_material_id = response['id']
            self.log_test("Create Material", True)
            return True
        else:
            self.log_test("Create Material", False, f"Status: {status}, Response: {response}")
            return False

    def test_get_materials(self):
        """Test get materials"""
        if not self.admin_token:
            self.log_test("Get Materials", False, "No admin token")
            return False
            
        success, response, status = self.make_request('GET', 'materials', token=self.admin_token)
        self.log_test("Get Materials", success and isinstance(response, list))
        return success

    def test_create_gallery_item(self):
        """Test gallery item creation"""
        if not self.admin_token:
            self.log_test("Create Gallery Item", False, "No admin token")
            return False

        data = {
            "title": "Test Gallery Item",
            "description": "Test description",
            "image_url": "https://example.com/test-image.jpg",
            "category": "bridal"
        }
        
        success, response, status = self.make_request('POST', 'gallery', data, self.admin_token, 200)
        
        if success and 'id' in response:
            self.created_gallery_id = response['id']
            self.log_test("Create Gallery Item", True)
            return True
        else:
            self.log_test("Create Gallery Item", False, f"Status: {status}, Response: {response}")
            return False

    def test_get_gallery(self):
        """Test get gallery (public endpoint)"""
        success, response, status = self.make_request('GET', 'gallery')
        self.log_test("Get Gallery", success and isinstance(response, list))
        return success

    def test_dashboard_stats(self):
        """Test dashboard stats"""
        if not self.admin_token:
            self.log_test("Dashboard Stats", False, "No admin token")
            return False
            
        success, response, status = self.make_request('GET', 'dashboard/stats', token=self.admin_token)
        expected_keys = ['monthly_orders', 'weekly_orders', 'monthly_income', 'weekly_income']
        has_keys = all(key in response for key in expected_keys) if success else False
        self.log_test("Dashboard Stats", success and has_keys)
        return success

    def test_dashboard_charts(self):
        """Test dashboard charts"""
        if not self.admin_token:
            self.log_test("Dashboard Charts", False, "No admin token")
            return False
            
        success, response, status = self.make_request('GET', 'dashboard/charts', token=self.admin_token)
        self.log_test("Dashboard Charts", success and isinstance(response, list))
        return success

    def test_logout(self):
        """Test logout"""
        success, response, status = self.make_request('POST', 'auth/logout')
        self.log_test("Logout", success)
        return success

    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting Kshana Contour API Tests...")
        print(f"📍 Testing against: {self.base_url}")
        print("=" * 60)

        # Basic tests
        self.test_root_endpoint()
        
        # Auth tests
        self.test_admin_login()
        self.test_admin_me()
        
        # Order management tests
        self.test_create_order()
        self.test_get_orders()
        self.test_get_order_detail()
        self.test_update_order_status()
        self.test_add_payment()
        
        # Customer tests
        self.test_customer_login()
        self.test_customer_orders()
        
        # Employee tests
        self.test_create_employee()
        self.test_get_employees()
        
        # Material tests
        self.test_create_material()
        self.test_get_materials()
        
        # Gallery tests
        self.test_create_gallery_item()
        self.test_get_gallery()
        
        # Dashboard tests
        self.test_dashboard_stats()
        self.test_dashboard_charts()
        
        # Cleanup
        self.test_logout()

        # Results
        print("=" * 60)
        print(f"📊 Test Results: {self.tests_passed}/{self.tests_run} passed")
        success_rate = (self.tests_passed / self.tests_run) * 100 if self.tests_run > 0 else 0
        print(f"📈 Success Rate: {success_rate:.1f}%")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All tests passed!")
            return 0
        else:
            print("⚠️  Some tests failed!")
            return 1

def main():
    tester = KshanaContourAPITester()
    return tester.run_all_tests()

if __name__ == "__main__":
    sys.exit(main())