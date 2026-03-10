from prompt_toolkit.shortcuts import choice
from prompt_toolkit.filters import is_done
import asyncio
import sys

from universities.monash import MonashUniversity

university_data = {
	"Monash University": MonashUniversity()
}

def select_university():
	selected_uni = choice(
		message="Select a university:",
		options=[(university_data[uni], uni) for uni in university_data.keys()],
		show_frame=~is_done
	)

	return selected_uni

def select_uni_action(selected_uni):
	uni_action = choice(
		message=f"What would you like to do with {selected_uni.name}?",
		options=[
			("fetch_faculties", "Fetch faculties"),
			("upsert_db", "Upsert into database")
		],
		show_frame=~is_done
	)

	return uni_action

def select_faculty(selected_uni):
	uni_faculties = selected_uni.get_faculty_names()

	selected_faculty = choice(
		message=f"Select a faculty from {selected_uni.name}:",
		options=[(faculty, faculty) for faculty in uni_faculties],
		show_frame=~is_done
	)

	return selected_faculty

def select_faculty_action(selected_faculty):
	uni_action = choice(
		message=f"What would you like to do with {selected_faculty}?",
		options=[
			("fetch_degrees", "Fetch faculty degrees"),
			("fetch_aos", "Fetch faculty areas of study"),
			("fetch_units", "Fetch faculty units"),
			("upsert_db", "Upsert into database")
		],
		show_frame=~is_done
	)

	return uni_action

def select_fetched_data_action(data_count):
	fetched_degree_action = choice(
		message=f"What would you like to do with {data_count} items?",
		options=[
			("select_one", "Select a specific item"),
			("upsert_db", "Upsert all data into database")
		],
		show_frame=~is_done
	)

	return fetched_degree_action

async def upsert_all_degrees(selected_uni, selected_faculty, uni_courses):
	for course in uni_courses:
		await selected_uni.upsert_degree(selected_faculty, course)

async def upsert_all_units(selected_uni, selected_faculty, uni_units):
	for unit in uni_units:
		await selected_uni.upsert_unit(selected_faculty, unit)

if __name__ == "__main__":
	selected_uni = select_university()
	uni_action = select_uni_action(selected_uni)

	if uni_action == "upsert_db":
		asyncio.run(selected_uni.upsert_university())
		print(f"{selected_uni.name} upserted into database successfully!")
		sys.exit()

	selected_faculty = select_faculty(selected_uni)
	selected_faculty_action = select_faculty_action(selected_faculty)

	if selected_faculty_action == "upsert_db":
		asyncio.run(selected_uni.upsert_faculty(selected_faculty))
		print(f"{selected_faculty} faculty upserted into database successfully!")
		sys.exit()
	
	elif selected_faculty_action == "fetch_degrees":
		uni_courses = asyncio.run(selected_uni.fetch_faculty_data(selected_faculty, "course"))
		fetched_degree_action = select_fetched_data_action(len(uni_courses))

		if fetched_degree_action == "upsert_db":
			asyncio.run(upsert_all_degrees(selected_uni, selected_faculty, uni_courses))
			sys.exit()
	
	elif selected_faculty_action == "fetch_aos":
		uni_aos = asyncio.run(selected_uni.fetch_faculty_data(selected_faculty, "aos"))
		fetched_data_action = select_fetched_data_action(len(uni_aos))
	
	elif selected_faculty_action == "fetch_units":
		uni_units = asyncio.run(selected_uni.fetch_faculty_data(selected_faculty, "subject"))
		fetched_data_action = select_fetched_data_action(len(uni_units))

		if fetched_data_action == "upsert_db":
			asyncio.run(upsert_all_units(selected_uni, selected_faculty, uni_units))
			sys.exit()

