use serde::{Deserialize, Serialize};
use chrono::NaiveDate;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Staff {
    pub id: Option<i32>,

    // Identification & Personal Details
    pub appointment_number: String,
    pub full_name: String,
    pub gender: String,
    pub date_of_birth: String, // Format: dd-MM-yyyy
    pub age: i32,
    pub nic_number: String, // Will be stored as new format
    pub marital_status: String,
    pub address_line1: String,
    pub address_line2: Option<String>,
    pub address_line3: Option<String>,
    pub contact_number: String,
    pub email: Option<String>,

    // Employment Details
    pub designation: String,
    pub date_of_first_appointment: String, // Format: dd-MM-yyyy
    pub date_of_retirement: String, // Auto-calculated
    pub increment_date: String, // Format: dd-MM

    // Salary Information
    pub salary_code: String,
    pub basic_salary: f64,
    pub increment_amount: f64,

    // Image
    pub image_path: Option<String>,

    // System fields
    pub created_at: Option<String>,
    pub updated_at: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct StaffSearch {
    pub query: Option<String>,
    pub designation: Option<String>,
    pub gender: Option<String>,
    pub marital_status: Option<String>,
    pub salary_code: Option<String>,
    pub age_min: Option<i32>,
    pub age_max: Option<i32>,
    pub nic_number: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct StaffCount {
    pub total: i32,
    pub by_designation: Vec<DesignationCount>,
    pub by_gender: Vec<GenderCount>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct DesignationCount {
    pub designation: String,
    pub count: i32,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct GenderCount {
    pub gender: String,
    pub count: i32,
}

impl Default for Staff {
    fn default() -> Self {
        Staff {
            id: None,
            appointment_number: String::new(),
            full_name: String::new(),
            gender: String::from("Male"),
            date_of_birth: String::new(),
            age: 0,
            nic_number: String::new(),
            marital_status: String::from("Single"),
            address_line1: String::new(),
            address_line2: None,
            address_line3: None,
            contact_number: String::new(),
            email: None,
            designation: String::new(),
            date_of_first_appointment: String::new(),
            date_of_retirement: String::new(),
            increment_date: String::new(),
            salary_code: String::new(),
            basic_salary: 0.0,
            increment_amount: 0.0,
            image_path: None,
            created_at: None,
            updated_at: None,
        }
    }
}