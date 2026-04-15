"""Seed partnership investment data for Kshana Contour"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
load_dotenv()

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

PARTNERSHIP_DATA = [
    {"date":"2026-01-02","order":"NA","reason":"SIM Cards","paid_to":"Airtel","chandana":300,"akanksha":0,"sbi":0,"mode":"UPI","comments":""},
    {"date":"2026-01-02","order":"NA","reason":"CC camera","paid_to":"Amazon","chandana":4199,"akanksha":0,"sbi":0,"mode":"UPI","comments":""},
    {"date":"2026-01-02","order":"1","reason":"Kuchchu","paid_to":"Ramaa","chandana":0,"akanksha":1350,"sbi":0,"mode":"UPI","comments":""},
    {"date":"2026-01-06","order":"1","reason":"Kuchchu","paid_to":"Ramaa","chandana":450,"akanksha":0,"sbi":0,"mode":"UPI","comments":""},
    {"date":"2026-01-06","order":"NA","reason":"Tabrez Flight ticket","paid_to":"NA","chandana":0,"akanksha":9551,"sbi":0,"mode":"Card","comments":""},
    {"date":"2026-01-14","order":"NA","reason":"Shop interior","paid_to":"Arun","chandana":20000,"akanksha":0,"sbi":0,"mode":"UPI","comments":""},
    {"date":"2026-01-21","order":"NA","reason":"Shop interior","paid_to":"Arun","chandana":20000,"akanksha":0,"sbi":0,"mode":"UPI","comments":""},
    {"date":"2026-01-19","order":"NA","reason":"Ceiling fan","paid_to":"Amazon","chandana":0,"akanksha":2000,"sbi":0,"mode":"UPI","comments":""},
    {"date":"2026-01-27","order":"NA","reason":"Sofa stitching","paid_to":"Harshith","chandana":1000,"akanksha":0,"sbi":0,"mode":"UPI","comments":""},
    {"date":"2026-01-27","order":"NA","reason":"Sofa cloth","paid_to":"Mohammed Rafi","chandana":4000,"akanksha":0,"sbi":0,"mode":"UPI","comments":""},
    {"date":"2026-01-27","order":"NA","reason":"Shop Interior","paid_to":"Arun","chandana":20000,"akanksha":0,"sbi":0,"mode":"UPI","comments":""},
    {"date":"2026-01-27","order":"NA","reason":"Shop essentials (Storage organizers)","paid_to":"Blinkit","chandana":1251,"akanksha":0,"sbi":0,"mode":"UPI","comments":""},
    {"date":"2026-01-27","order":"NA","reason":"Shop essentials (Storage bags)","paid_to":"Blinkit","chandana":1328,"akanksha":0,"sbi":0,"mode":"UPI","comments":""},
    {"date":"2026-01-27","order":"NA","reason":"Shop essentials (Cleaning)","paid_to":"Blinkit","chandana":2049,"akanksha":0,"sbi":0,"mode":"UPI","comments":""},
    {"date":"2026-01-27","order":"NA","reason":"Shop essentials (Extension boxes)","paid_to":"Blinkit","chandana":1030,"akanksha":0,"sbi":0,"mode":"UPI","comments":""},
    {"date":"2026-01-27","order":"NA","reason":"Shop essentials","paid_to":"Blinkit","chandana":1543,"akanksha":0,"sbi":0,"mode":"UPI","comments":""},
    {"date":"2026-01-27","order":"NA","reason":"Shop essentials","paid_to":"Blinkit","chandana":2853,"akanksha":0,"sbi":0,"mode":"UPI","comments":""},
    {"date":"2026-01-27","order":"NA","reason":"Shop essentials","paid_to":"Blinkit","chandana":1890,"akanksha":0,"sbi":0,"mode":"UPI","comments":""},
    {"date":"2026-01-27","order":"NA","reason":"Shop essentials","paid_to":"Blinkit","chandana":1947,"akanksha":0,"sbi":0,"mode":"UPI","comments":""},
    {"date":"2026-01-27","order":"NA","reason":"Wifi","paid_to":"Atria Convergence","chandana":1979,"akanksha":0,"sbi":0,"mode":"UPI","comments":""},
    {"date":"2026-01-27","order":"NA","reason":"Agreement, fruits and flowers","paid_to":"Srinivasa Reddy","chandana":3000,"akanksha":0,"sbi":0,"mode":"UPI","comments":""},
    {"date":"2026-01-28","order":"NA","reason":"Pooja","paid_to":"Anand Swamy","chandana":5000,"akanksha":0,"sbi":0,"mode":"Cash","comments":""},
    {"date":"2026-01-28","order":"NA","reason":"Food","paid_to":"Nandhini","chandana":4700,"akanksha":0,"sbi":0,"mode":"Cash","comments":""},
    {"date":"2026-01-29","order":"NA","reason":"Owner advance","paid_to":"Shop Owner","chandana":0,"akanksha":50000,"sbi":0,"mode":"Cash","comments":""},
    {"date":"2026-01-29","order":"NA","reason":"Tabrez","paid_to":"Shop","chandana":50000,"akanksha":0,"sbi":0,"mode":"UPI","comments":""},
    {"date":"2026-01-29","order":"NA","reason":"Tabrez","paid_to":"Shop","chandana":0,"akanksha":100000,"sbi":0,"mode":"Cash","comments":""},
    {"date":"2026-01-30","order":"NA","reason":"Tabrez","paid_to":"Shop","chandana":50000,"akanksha":0,"sbi":0,"mode":"UPI","comments":""},
    {"date":"2026-01-30","order":"NA","reason":"Tabrez Room advance","paid_to":"Room advance","chandana":40000,"akanksha":0,"sbi":0,"mode":"UPI","comments":""},
    {"date":"2026-01-28","order":"NA","reason":"Shop essentials (Containers, Dust bin)","paid_to":"Zepto","chandana":0,"akanksha":1788,"sbi":0,"mode":"UPI","comments":""},
    {"date":"2026-01-28","order":"NA","reason":"Name board","paid_to":"Preeti Dodmani","chandana":0,"akanksha":4500,"sbi":0,"mode":"Cash","comments":""},
    {"date":"2026-01-28","order":"NA","reason":"Sweets for pooja","paid_to":"Swiggy","chandana":0,"akanksha":1089,"sbi":0,"mode":"Cash","comments":""},
    {"date":"2026-01-28","order":"NA","reason":"Fan for boutique","paid_to":"Amazon","chandana":0,"akanksha":2000,"sbi":0,"mode":"UPI","comments":""},
    {"date":"2026-02-02","order":"NA","reason":"Name board rectification","paid_to":"Preeti Dodmani","chandana":0,"akanksha":600,"sbi":0,"mode":"UPI","comments":""},
    {"date":"2026-02-07","order":"NA","reason":"Ragib Payment","paid_to":"Ragib","chandana":0,"akanksha":8500,"sbi":0,"mode":"UPI","comments":""},
    {"date":"2026-02-03","order":"NA","reason":"Shop Rent - February","paid_to":"Venkatanarayana","chandana":0,"akanksha":12000,"sbi":0,"mode":"UPI","comments":""},
    {"date":"2026-02-07","order":"NA","reason":"Tabrez - lining and other material","paid_to":"Tabrez","chandana":0,"akanksha":2000,"sbi":0,"mode":"UPI","comments":""},
    {"date":"2026-02-07","order":"NA","reason":"Tabrez - Varsha blouse workers payment","paid_to":"Tabrez","chandana":0,"akanksha":15000,"sbi":0,"mode":"UPI","comments":""},
    {"date":"2026-02-07","order":"NA","reason":"Tahseen - Salary","paid_to":"Tahseen","chandana":0,"akanksha":5500,"sbi":0,"mode":"Cash","comments":""},
    {"date":"2026-02-08","order":"4,5,12,19","reason":"Worker Salary Feb 1st week","paid_to":"Tabrez","chandana":0,"akanksha":5700,"sbi":0,"mode":"UPI","comments":""},
    {"date":"2026-02-10","order":"12,14,15,32","reason":"Falls, Kuchchu and Zigzag","paid_to":"Anitha","chandana":0,"akanksha":1250,"sbi":0,"mode":"UPI","comments":""},
    {"date":"2026-02-15","order":"NA","reason":"Ragib Payment","paid_to":"Ragib","chandana":0,"akanksha":0,"sbi":5600,"mode":"UPI","comments":""},
    {"date":"2026-02-15","order":"NA","reason":"Bill books","paid_to":"Ranjith","chandana":0,"akanksha":3750,"sbi":0,"mode":"UPI","comments":""},
    {"date":"2026-02-15","order":"NA","reason":"Tahseen - Salary","paid_to":"Srinivasa Reddy","chandana":0,"akanksha":0,"sbi":5500,"mode":"UPI","comments":""},
    {"date":"2026-02-16","order":"19,18,23","reason":"Worker Salary Feb 2nd week + Material","paid_to":"Tabrez","chandana":0,"akanksha":0,"sbi":9667,"mode":"UPI","comments":""},
    {"date":"2026-02-18","order":"NA","reason":"Shop Interior","paid_to":"Arun","chandana":20000,"akanksha":0,"sbi":0,"mode":"UPI","comments":""},
    {"date":"2026-02-18","order":"NA","reason":"Falls, Kuchchu and Zigzag","paid_to":"Anitha","chandana":0,"akanksha":0,"sbi":500,"mode":"Cash","comments":""},
    {"date":"2026-02-19","order":"NA","reason":"Falls Zig+Zag","paid_to":"Anitha","chandana":0,"akanksha":350,"sbi":0,"mode":"UPI","comments":""},
    {"date":"2026-02-23","order":"23,13,33,30,41","reason":"Worker salary Feb 3rd week","paid_to":"Tabrez","chandana":0,"akanksha":0,"sbi":6080,"mode":"UPI","comments":""},
    {"date":"2026-02-23","order":"NA","reason":"Blouse cutting","paid_to":"Tabrez","chandana":0,"akanksha":0,"sbi":3332,"mode":"UPI","comments":""},
    {"date":"2026-02-23","order":"NA","reason":"Blouse cutting","paid_to":"Tabrez","chandana":0,"akanksha":0,"sbi":3000,"mode":"Cash","comments":""},
    {"date":"2026-02-27","order":"NA","reason":"Blouse cutting","paid_to":"Tabrez","chandana":0,"akanksha":0,"sbi":850,"mode":"Cash","comments":""},
    {"date":"2026-02-27","order":"NA","reason":"Dad Salary","paid_to":"Srinivasa Reddy","chandana":0,"akanksha":0,"sbi":10000,"mode":"UPI","comments":""},
    {"date":"2026-03-02","order":"NA","reason":"Falls, Kuchchu and Zigzag","paid_to":"Anitha","chandana":0,"akanksha":0,"sbi":1130,"mode":"UPI","comments":""},
    {"date":"2026-03-02","order":"NA","reason":"Blouse cutting","paid_to":"Tabrez","chandana":0,"akanksha":0,"sbi":3022,"mode":"UPI","comments":""},
    {"date":"2026-03-02","order":"NA","reason":"Blouse cutting","paid_to":"Tabrez","chandana":0,"akanksha":0,"sbi":866,"mode":"UPI","comments":""},
    {"date":"2026-02-23","order":"NA","reason":"Tahseen - Salary","paid_to":"Srinivasa Reddy","chandana":0,"akanksha":0,"sbi":5500,"mode":"UPI","comments":"2000 Cash + 1500 UPI"},
    {"date":"2026-03-09","order":"NA","reason":"Worker room rent","paid_to":"Tabrez","chandana":0,"akanksha":0,"sbi":8000,"mode":"UPI","comments":""},
    {"date":"2026-03-09","order":"NA","reason":"Tahseen - Salary","paid_to":"Srinivasa Reddy","chandana":0,"akanksha":0,"sbi":5500,"mode":"UPI","comments":""},
    {"date":"2026-03-09","order":"NA","reason":"Materials - Market","paid_to":"Srinivasa Reddy","chandana":0,"akanksha":0,"sbi":7800,"mode":"Cash","comments":""},
    {"date":"2026-03-09","order":"NA","reason":"Blouse cutting","paid_to":"Tabrez","chandana":0,"akanksha":0,"sbi":4660,"mode":"UPI","comments":""},
    {"date":"2026-03-09","order":"NA","reason":"Falls, Kuchchu and Zigzag","paid_to":"Anitha","chandana":0,"akanksha":0,"sbi":1330,"mode":"UPI","comments":""},
    {"date":"2026-03-11","order":"NA","reason":"Worker salary March 1st week","paid_to":"Tabrez","chandana":0,"akanksha":0,"sbi":5130,"mode":"UPI","comments":""},
    {"date":"2026-03-11","order":"NA","reason":"Tabrez","paid_to":"Srinivasa Reddy","chandana":100000,"akanksha":0,"sbi":0,"mode":"UPI","comments":""},
    {"date":"2026-03-16","order":"NA","reason":"Shop interior","paid_to":"Arun","chandana":10000,"akanksha":0,"sbi":0,"mode":"UPI","comments":""},
    {"date":"2026-03-17","order":"NA","reason":"Falls, Kuchchu and Zigzag","paid_to":"Anitha","chandana":0,"akanksha":0,"sbi":850,"mode":"UPI","comments":""},
    {"date":"2026-03-17","order":"NA","reason":"Worker salary March 2nd week","paid_to":"Tabrez","chandana":0,"akanksha":0,"sbi":1805,"mode":"UPI","comments":""},
    {"date":"2026-03-17","order":"NA","reason":"Tahseen - Salary","paid_to":"Srinivasa Reddy","chandana":0,"akanksha":0,"sbi":5500,"mode":"Cash","comments":""},
    {"date":"2026-03-17","order":"NA","reason":"Khadim - tailor","paid_to":"Srinivasa Reddy","chandana":0,"akanksha":0,"sbi":1500,"mode":"Cash","comments":""},
    {"date":"2026-03-17","order":"NA","reason":"Hathik - worker","paid_to":"Srinivasa Reddy","chandana":0,"akanksha":0,"sbi":1000,"mode":"Cash","comments":""},
    {"date":"2026-03-17","order":"NA","reason":"Lining and other material","paid_to":"Srinivasa Reddy","chandana":0,"akanksha":0,"sbi":1000,"mode":"Cash","comments":""},
]

async def seed():
    # Clear existing
    await db.partnership.delete_many({})
    
    for entry in PARTNERSHIP_DATA:
        await db.partnership.insert_one(entry)
    
    print(f"Seeded {len(PARTNERSHIP_DATA)} partnership entries")
    
    # Verify totals
    all_entries = await db.partnership.find({}, {"_id": 0}).to_list(1000)
    chandana_total = sum(e.get("chandana", 0) for e in all_entries)
    akanksha_total = sum(e.get("akanksha", 0) for e in all_entries)
    sbi_total = sum(e.get("sbi", 0) for e in all_entries)
    
    print(f"Chandana invested: {chandana_total}")
    print(f"Akanksha invested: {akanksha_total}")
    print(f"Kshana (SBI) Account paid: {sbi_total}")
    print(f"Total investments: {chandana_total + akanksha_total}")

if __name__ == "__main__":
    asyncio.run(seed())
