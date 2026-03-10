import json

import httpx
import asyncio
from generated.prisma import Prisma, Json
from constants import DEGREE_LEVEL

COURSELOOP_API = "https://api-ap-southeast-2.prod.courseloop.com/publisher/browsepage-academic-items"
COURSELOOP_HEADERS = {
    "accept": "*/*",
    "accept-language": "en-US,en;q=0.9",
    "cache-control": "no-cache",
    "origin": "https://handbook.monash.edu",
    "pragma": "no-cache",
    "referer": "https://handbook.monash.edu/",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "cross-site",
}

SITE_ID = "monash-prod-pres"
IMPLEMENTATION_YEAR = "2026"
PAGE_LIMIT = 10

HANDBOOK_URL = "https://handbook.monash.edu"
FACULTIES = {
	"Faculty of Arts, Design and Architecture": {
		"api_id": "f3c74653dba8a3406add773c34961909",
		"short_code": "ARC"
	},
	"Faculty of Arts": {
		"api_id": "db388653dba8a3406add773c3496190e",
		"short_code": "ART"
	},
	"Faculty of Business and Economics": {
		"api_id": "4a488253dba8a3406add773c3496191c",
		"short_code": "BUS"
	},
	"Faculty of Education": {
		"api_id": "d4580a53dba8a3406add773c3496198b",
		"short_code": "EDU"
	},
	"Faculty of Engineering": {
		"api_id": "6a584a53dba8a3406add773c34961974",
		"short_code": "ENG"
	},
	"Faculty of Information Technology": {
		"api_id": "c5684a53dba8a3406add773c349619a1",
		"short_code": "FIT"
	},
	"Faculty of Law": {
		"api_id": "6f68c653dba8a3406add773c349619b4",
		"short_code": "LAW"
	},
	"Faculty of Medicine, Nursing and Health Sciences": {
		"api_id": "12788a53dba8a3406add773c3496194e",
		"short_code": "MED"
	},
	"Faculty of Pharmacy and Pharmaceutical Sciences": {
		"api_id": "38884a53dba8a3406add773c34961960",
		"short_code": "PHA"
	},
	"Faculty of Science": {
		"api_id": "af888a53dba8a3406add773c3496194e",
		"short_code": "SCI"
	},
	"Monash Sustainable Development Institute": {
		"api_id": "1c6347f0db3067406add773c34961972",
		"short_code": "SUS"
	},
	"Monash University Accident Research Centre": {
		"api_id": "3d53cb70db3067406add773c34961989",
		"short_code": "ACR"
	},
	"Office of the DVC Education and Senior VP": {
		"api_id": "4f2f2536dbb219101f75f561f3961940",
		"short_code": "DVCE"
	},
	"Office of the DVC Student Experience and Senior VP": {
		"api_id": "8a39f5768795d610cb334009dabb3540",
		"short_code": "DVCS"
	}
}

# Shared async client — reuse across all scrapers
_client: httpx.AsyncClient | None = None

def get_client() -> httpx.AsyncClient:
    global _client
    if _client is None or _client.is_closed:
        _client = httpx.AsyncClient(
            headers={
                "User-Agent": "Mozilla/5.0 (research/educational scraper - contact: your@email.com)",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            },
            timeout=30.0,
            follow_redirects=True,
        )
    return _client

class MonashUniversity:
	def __init__(self):
		self.name = "Monash University"
		self.short_name = "Monash"
		self.campuses = [
			{"name": "Clayton", "country": "Australia"},
			{"name": "Caulfield", "country": "Australia"}
		]
		self.handbook = HANDBOOK_URL
		self.faculties = FACULTIES
		self.db = Prisma()
	
	async def upsert_university(self):
		if self.db.is_connected() == False:
			await self.db.connect()

		await self.db.university.upsert(
			where={"name": self.name},
			data={
				"create": {
					"name": self.name,
					"short_name": self.short_name,
					"campuses": Json(self.campuses),
				},
				"update": {
					"short_name": self.short_name,
					"campuses": Json(self.campuses),
				}
			},
		)
	
	async def upsert_faculty(self, faculty):
		if self.db.is_connected() == False:
			await self.db.connect()

		uni_id = await self.db.university.find_unique(where={"name": self.name})
		if not uni_id:
			return

		await self.db.faculty.upsert(
			where={
				"title_universityId": {
					"title": faculty,
					"universityId": uni_id.id
				}
			},
			data={
				"create": {
					"title": faculty,
					"universityId": uni_id.id,
					"code": self.faculties[faculty]["short_code"]
				},
				"update": {
					"code": self.faculties[faculty]["short_code"]
				}
			},
		)
	
	async def upsert_degree(self, faculty, degree):
		if self.db.is_connected() == False:
			await self.db.connect()

		uni_id = await self.db.university.find_unique(where={"name": self.name})
		if not uni_id:
			return
		
		
		faculty_id = await self.db.faculty.find_unique(
			where={
				"title_universityId": {
					"title": faculty,
					"universityId": uni_id.id
				}
			}
		)
		if not faculty_id:
			return
		
		await self.db.degree.upsert(
			where={
				"title_universityId": {
					"title": degree["title"],
					"universityId": uni_id.id
				}
			},
			data={
				"create": {
					"title": degree["title"],
					"code": degree["code"],
					#"studyLevel": degree["studyLevel"],
					"universityId": uni_id.id,
					"facultyId": faculty_id.id,

					"total_credits": 0,
					"duration_months": 0,
					"required_units": Json([]) 

				},
				"update": {
					"code": degree["code"],
					#"studyLevel": degree["studyLevel"],
				}
			},
		)
	
	async def upsert_unit(self, faculty, unit):
		if self.db.is_connected() == False:
			await self.db.connect()

		uni_id = await self.db.university.find_unique(where={"name": self.name})
		if not uni_id:
			return
		
		faculty_id = await self.db.faculty.find_unique(
			where={
				"title_universityId": {
					"title": faculty,
					"universityId": uni_id.id
				}
			}
		)
		if not faculty_id:
			return
		
		await self.db.unit.upsert(
			where={
				"code_universityId": {
					"code": unit["code"],
					"universityId": uni_id.id
				}
			},
			data={
				"create": {
					"name": unit["name"],
					"code": unit["code"],
					"credits": int(unit["credits"]) if unit.get("credits") else -1,
					"level": DEGREE_LEVEL.get(unit["studyLevel"], -1),
					"description": unit["description"],
					"universityId": uni_id.id,
					"facultyId": faculty_id.id,
					"offerings": Json(unit["offerings"])
				},
				"update": {
					"code": unit["code"],
					"level": DEGREE_LEVEL.get(unit["studyLevel"], -1),
					"offerings": Json(unit["offerings"])
				}
			},
		)

	def get_handbook(self):
		return self.handbook
	
	def get_faculty_names(self):
		return self.faculties.keys()
	
	def faculty_url(self, faculty_name):
		return f"{self.handbook}/browse/By%20Faculty/{faculty_name.replace(' ', '')}"
	
	async def fetch_faculty_data(self, faculty_name, contentType):
		faculty_info = self.faculties.get(faculty_name)
		if not faculty_info:
			return []
		
		api_id = faculty_info["api_id"]
		if not api_id:
			return []
		
		# Implement API fetching logic here using COURSELOOP_API and COURSELOOP_HEADERS
		# Use api_id to fetch the relevant degrees for the faculty
		# Handle pagination if necessary using PAGE_LIMIT

		res = []

		for studyLevel in ["Undergraduate", "Postgraduate", "Research"]:
			areasOfStudy = ["hdr"] if studyLevel == "Research" else (["major", "ug-specialisation", "minor", "extended_major", "honours"] if studyLevel == "Undergraduate" else ["pg-specialisation"])

			for aos in areasOfStudy:
				body = {
					"siteId": SITE_ID,
					"contentType": contentType,
					"queryParams": [
						{"queryField": "parentAcademicOrg", "queryValue": api_id},
						{"queryField": "implementationYear", "queryValue": IMPLEMENTATION_YEAR},
						{"queryField": "studyLevel", "queryValue": studyLevel},
					],
					"limit": PAGE_LIMIT,
					"offset": 0
				}

				if contentType == "aos":
					body["queryParams"].append({"queryField": "areasOfStudy", "queryValue": aos})

				index = 0

				while True:
					await asyncio.sleep(0.1)

					client = get_client()
					response = await client.post(COURSELOOP_API, headers=COURSELOOP_HEADERS, json=body)
					if response.status_code != 200:
						break
					
					data = response.json()
					mainData = data.get("data", {})
					items = mainData.get("data", [])
					if not items:
						break
					
					for item in items:
						"""
						with open(".server/debug2.json", "w") as f:
							import json
							json.dump({
								"data": json.loads(item.get("data", "{}")),
								"CurriculumStructure": json.loads(item.get("curriculumStructure", "{}"))
							}, f, indent=2)
						"""

						if contentType =="course":
							course_info = {
								"title": item.get("title"),
								"shortName": item.get("abbreviatedName"),
								"code": item.get("code"),
								"studyLevel": item.get("studyLevel"),
								"url": f"{self.handbook}/{item.get('urlMap')}"
							}
							res.append(course_info)
						
						elif contentType == "aos":
							aos_info = {
								"title": item.get("title"),
								"code": item.get("code"),
								"studyLevel": item.get("studyLevel"),
							}
							res.append(aos_info)
						
						elif contentType == "subject":
							unit_data = json.loads(item.get("data", "{}"))
							unit_info = {
								"name": item.get("title"),
								"description": item.get("description"),
								"credits": item.get("creditPoints"),
								"code": item.get("code"),
								"studyLevel": item.get("studyLevel"),
								"department": unit_data.get("academic_org", {}).get("value"),
								"url": f"{self.handbook}/{item.get('urlMap')}",
								"offerings": unit_data.get("unit_offering", [])
							}
							res.append(unit_info)
							
					index += PAGE_LIMIT
					body["offset"] = index
				
					if PAGE_LIMIT > mainData.get("count", 0):
						break
				
				if contentType != "aos":
					break
		
		return res