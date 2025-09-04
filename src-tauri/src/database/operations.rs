use rusqlite::{params, Connection, Result};
use std::path::Path;
use chrono::Utc;
use crate::database::models::{Staff, StaffSearch, StaffCount, DesignationCount, GenderCount};

const DB_PATH: &str = "forest_office_staff.db";

pub fn get_connection() -> Result<Connection> {
    let conn = Connection::open(DB_PATH)?;
    conn.execute("PRAGMA foreign_keys = ON", [])?;
    Ok(conn)
}

pub fn initialize_database() -> Result<()> {
    let conn = get_connection()?;

    conn.execute(
        "CREATE TABLE IF NOT EXISTS staff (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            appointment_number TEXT NOT NULL UNIQUE,
            full_name TEXT NOT NULL,
            gender TEXT NOT NULL,
            date_of_birth TEXT NOT NULL,
            age INTEGER NOT NULL,
            nic_number TEXT NOT NULL,
            marital_status TEXT NOT NULL,
            address_line1 TEXT NOT NULL,
            address_line2 TEXT,
            address_line3 TEXT,
            contact_number TEXT NOT NULL,
            email TEXT,
            designation TEXT NOT NULL,
            date_of_first_appointment TEXT NOT NULL,
            date_of_retirement TEXT NOT NULL,
            increment_date TEXT NOT NULL,
            salary_code TEXT NOT NULL,
            basic_salary REAL NOT NULL,
            increment_amount REAL NOT NULL,
            image_path TEXT,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
        )",
        [],
    )?;

    // Create indexes for better search performance
    conn.execute(
        "CREATE INDEX IF NOT EXISTS idx_staff_name ON staff(full_name)",
        [],
    )?;

    conn.execute(
        "CREATE INDEX IF NOT EXISTS idx_staff_nic ON staff(nic_number)",
        [],
    )?;

    conn.execute(
        "CREATE INDEX IF NOT EXISTS idx_staff_designation ON staff(designation)",
        [],
    )?;

    Ok(())
}

pub fn insert_staff(staff: &Staff) -> Result<i64> {
    let conn = get_connection()?;
    let now = Utc::now().format("%Y-%m-%d %H:%M:%S").to_string();

    conn.execute(
        "INSERT INTO staff (
            appointment_number, full_name, gender, date_of_birth, age, nic_number,
            marital_status, address_line1, address_line2, address_line3,
            contact_number, email, designation, date_of_first_appointment,
            date_of_retirement, increment_date, salary_code, basic_salary,
            increment_amount, image_path, created_at, updated_at
        ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15, ?16, ?17, ?18, ?19, ?20, ?21, ?22)",
        params![
            staff.appointment_number,
            staff.full_name,
            staff.gender,
            staff.date_of_birth,
            staff.age,
            staff.nic_number,
            staff.marital_status,
            staff.address_line1,
            staff.address_line2,
            staff.address_line3,
            staff.contact_number,
            staff.email,
            staff.designation,
            staff.date_of_first_appointment,
            staff.date_of_retirement,
            staff.increment_date,
            staff.salary_code,
            staff.basic_salary,
            staff.increment_amount,
            staff.image_path,
            now,
            now
        ],
    )?;

    Ok(conn.last_insert_rowid())
}

pub fn get_all_staff_from_db() -> Result<Vec<Staff>> {
    let conn = get_connection()?;
    let mut stmt = conn.prepare(
        "SELECT id, appointment_number, full_name, gender, date_of_birth, age, nic_number,
         marital_status, address_line1, address_line2, address_line3, contact_number, email,
         designation, date_of_first_appointment, date_of_retirement, increment_date,
         salary_code, basic_salary, increment_amount, image_path, created_at, updated_at
         FROM staff ORDER BY full_name"
    )?;

    let staff_iter = stmt.query_map([], |row| {
        Ok(Staff {
            id: Some(row.get(0)?),
            appointment_number: row.get(1)?,
            full_name: row.get(2)?,
            gender: row.get(3)?,
            date_of_birth: row.get(4)?,
            age: row.get(5)?,
            nic_number: row.get(6)?,
            marital_status: row.get(7)?,
            address_line1: row.get(8)?,
            address_line2: row.get(9)?,
            address_line3: row.get(10)?,
            contact_number: row.get(11)?,
            email: row.get(12)?,
            designation: row.get(13)?,
            date_of_first_appointment: row.get(14)?,
            date_of_retirement: row.get(15)?,
            increment_date: row.get(16)?,
            salary_code: row.get(17)?,
            basic_salary: row.get(18)?,
            increment_amount: row.get(19)?,
            image_path: row.get(20)?,
            created_at: Some(row.get(21)?),
            updated_at: Some(row.get(22)?),
        })
    })?;

    let mut staff = Vec::new();
    for s in staff_iter {
        staff.push(s?);
    }

    Ok(staff)
}

pub fn get_staff_by_id_from_db(id: i32) -> Result<Option<Staff>> {
    let conn = get_connection()?;
    let mut stmt = conn.prepare(
        "SELECT id, appointment_number, full_name, gender, date_of_birth, age, nic_number,
         marital_status, address_line1, address_line2, address_line3, contact_number, email,
         designation, date_of_first_appointment, date_of_retirement, increment_date,
         salary_code, basic_salary, increment_amount, image_path, created_at, updated_at
         FROM staff WHERE id = ?1"
    )?;

    let mut rows = stmt.query_map(params![id], |row| {
        Ok(Staff {
            id: Some(row.get(0)?),
            appointment_number: row.get(1)?,
            full_name: row.get(2)?,
            gender: row.get(3)?,
            date_of_birth: row.get(4)?,
            age: row.get(5)?,
            nic_number: row.get(6)?,
            marital_status: row.get(7)?,
            address_line1: row.get(8)?,
            address_line2: row.get(9)?,
            address_line3: row.get(10)?,
            contact_number: row.get(11)?,
            email: row.get(12)?,
            designation: row.get(13)?,
            date_of_first_appointment: row.get(14)?,
            date_of_retirement: row.get(15)?,
            increment_date: row.get(16)?,
            salary_code: row.get(17)?,
            basic_salary: row.get(18)?,
            increment_amount: row.get(19)?,
            image_path: row.get(20)?,
            created_at: Some(row.get(21)?),
            updated_at: Some(row.get(22)?),
        })
    })?;

    match rows.next() {
        Some(staff) => Ok(Some(staff?)),
        None => Ok(None),
    }
}

pub fn update_staff_in_db(staff: &Staff) -> Result<()> {
    let conn = get_connection()?;
    let now = Utc::now().format("%Y-%m-%d %H:%M:%S").to_string();

    conn.execute(
        "UPDATE staff SET
            appointment_number = ?1, full_name = ?2, gender = ?3, date_of_birth = ?4,
            age = ?5, nic_number = ?6, marital_status = ?7, address_line1 = ?8,
            address_line2 = ?9, address_line3 = ?10, contact_number = ?11, email = ?12,
            designation = ?13, date_of_first_appointment = ?14, date_of_retirement = ?15,
            increment_date = ?16, salary_code = ?17, basic_salary = ?18,
            increment_amount = ?19, image_path = ?20, updated_at = ?21
         WHERE id = ?22",
        params![
            staff.appointment_number,
            staff.full_name,
            staff.gender,
            staff.date_of_birth,
            staff.age,
            staff.nic_number,
            staff.marital_status,
            staff.address_line1,
            staff.address_line2,
            staff.address_line3,
            staff.contact_number,
            staff.email,
            staff.designation,
            staff.date_of_first_appointment,
            staff.date_of_retirement,
            staff.increment_date,
            staff.salary_code,
            staff.basic_salary,
            staff.increment_amount,
            staff.image_path,
            now,
            staff.id
        ],
    )?;

    Ok(())
}

pub fn delete_staff_from_db(id: i32) -> Result<()> {
    let conn = get_connection()?;
    conn.execute("DELETE FROM staff WHERE id = ?1", params![id])?;
    Ok(())
}

pub fn search_staff_in_db(search: &StaffSearch) -> Result<Vec<Staff>> {
    let conn = get_connection()?;
    let mut query = String::from(
        "SELECT id, appointment_number, full_name, gender, date_of_birth, age, nic_number,
         marital_status, address_line1, address_line2, address_line3, contact_number, email,
         designation, date_of_first_appointment, date_of_retirement, increment_date,
         salary_code, basic_salary, increment_amount, image_path, created_at, updated_at
         FROM staff WHERE 1=1"
    );

    let mut params: Vec<Box<dyn rusqlite::ToSql>> = vec![];

    if let Some(ref q) = search.query {
        if !q.is_empty() {
            query.push_str(" AND (full_name LIKE ?1 OR appointment_number LIKE ?1)");
            params.push(Box::new(format!("%{}%", q)));
        }
    }

    if let Some(ref designation) = search.designation {
        if !designation.is_empty() {
            query.push_str(&format!(" AND designation = ?{}", params.len() + 1));
            params.push(Box::new(designation.clone()));
        }
    }

    if let Some(ref gender) = search.gender {
        if !gender.is_empty() {
            query.push_str(&format!(" AND gender = ?{}", params.len() + 1));
            params.push(Box::new(gender.clone()));
        }
    }

    if let Some(ref marital_status) = search.marital_status {
        if !marital_status.is_empty() {
            query.push_str(&format!(" AND marital_status = ?{}", params.len() + 1));
            params.push(Box::new(marital_status.clone()));
        }
    }

    if let Some(ref salary_code) = search.salary_code {
        if !salary_code.is_empty() {
            query.push_str(&format!(" AND salary_code = ?{}", params.len() + 1));
            params.push(Box::new(salary_code.clone()));
        }
    }

    if let Some(ref nic) = search.nic_number {
        if !nic.is_empty() {
            query.push_str(&format!(" AND nic_number LIKE ?{}", params.len() + 1));
            params.push(Box::new(format!("%{}%", nic)));
        }
    }

    if let Some(age_min) = search.age_min {
        query.push_str(&format!(" AND age >= ?{}", params.len() + 1));
        params.push(Box::new(age_min));
    }

    if let Some(age_max) = search.age_max {
        query.push_str(&format!(" AND age <= ?{}", params.len() + 1));
        params.push(Box::new(age_max));
    }

    query.push_str(" ORDER BY full_name");

    let mut stmt = conn.prepare(&query)?;
    let param_refs: Vec<&dyn rusqlite::ToSql> = params.iter().map(|p| p.as_ref()).collect();

    let staff_iter = stmt.query_map(param_refs.as_slice(), |row| {
        Ok(Staff {
            id: Some(row.get(0)?),
            appointment_number: row.get(1)?,
            full_name: row.get(2)?,
            gender: row.get(3)?,
            date_of_birth: row.get(4)?,
            age: row.get(5)?,
            nic_number: row.get(6)?,
            marital_status: row.get(7)?,
            address_line1: row.get(8)?,
            address_line2: row.get(9)?,
            address_line3: row.get(10)?,
            contact_number: row.get(11)?,
            email: row.get(12)?,
            designation: row.get(13)?,
            date_of_first_appointment: row.get(14)?,
            date_of_retirement: row.get(15)?,
            increment_date: row.get(16)?,
            salary_code: row.get(17)?,
            basic_salary: row.get(18)?,
            increment_amount: row.get(19)?,
            image_path: row.get(20)?,
            created_at: Some(row.get(21)?),
            updated_at: Some(row.get(22)?),
        })
    })?;

    let mut staff = Vec::new();
    for s in staff_iter {
        staff.push(s?);
    }

    Ok(staff)
}

pub fn get_staff_statistics() -> Result<StaffCount> {
    let conn = get_connection()?;

    // Get total count
    let total: i32 = conn.query_row("SELECT COUNT(*) FROM staff", [], |row| row.get(0))?;

    // Get count by designation
    let mut designation_stmt = conn.prepare("SELECT designation, COUNT(*) FROM staff GROUP BY designation ORDER BY designation")?;
    let designation_iter = designation_stmt.query_map([], |row| {
        Ok(DesignationCount {
            designation: row.get(0)?,
            count: row.get(1)?,
        })
    })?;

    let mut by_designation = Vec::new();
    for designation in designation_iter {
        by_designation.push(designation?);
    }

    // Get count by gender
    let mut gender_stmt = conn.prepare("SELECT gender, COUNT(*) FROM staff GROUP BY gender ORDER BY gender")?;
    let gender_iter = gender_stmt.query_map([], |row| {
        Ok(GenderCount {
            gender: row.get(0)?,
            count: row.get(1)?,
        })
    })?;

    let mut by_gender = Vec::new();
    for gender in gender_iter {
        by_gender.push(gender?);
    }

    Ok(StaffCount {
        total,
        by_designation,
        by_gender,
    })
}