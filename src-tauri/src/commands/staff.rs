use tauri::command;
use crate::database::models::{Staff, StaffSearch, StaffCount};
use crate::database::operations::{
    insert_staff, get_all_staff_from_db, get_staff_by_id_from_db,
    update_staff_in_db, delete_staff_from_db, search_staff_in_db,
    get_staff_statistics
};

#[command]
pub fn add_staff(staff: Staff) -> Result<String, String> {
    match insert_staff(&staff) {
        Ok(id) => Ok(format!("Staff added successfully with ID: {}", id)),
        Err(e) => Err(format!("Failed to add staff: {}", e)),
    }
}

#[command]
pub fn get_all_staff() -> Result<Vec<Staff>, String> {
    match get_all_staff_from_db() {
        Ok(staff) => Ok(staff),
        Err(e) => Err(format!("Failed to get staff: {}", e)),
    }
}

#[command]
pub fn get_staff_by_id(id: i32) -> Result<Option<Staff>, String> {
    match get_staff_by_id_from_db(id) {
        Ok(staff) => Ok(staff),
        Err(e) => Err(format!("Failed to get staff: {}", e)),
    }
}

#[command]
pub fn update_staff(staff: Staff) -> Result<String, String> {
    match update_staff_in_db(&staff) {
        Ok(_) => Ok("Staff updated successfully".to_string()),
        Err(e) => Err(format!("Failed to update staff: {}", e)),
    }
}

#[command]
pub fn delete_staff(id: i32) -> Result<String, String> {
    match delete_staff_from_db(id) {
        Ok(_) => Ok("Staff deleted successfully".to_string()),
        Err(e) => Err(format!("Failed to delete staff: {}", e)),
    }
}

#[command]
pub fn search_staff(search: StaffSearch) -> Result<Vec<Staff>, String> {
    match search_staff_in_db(&search) {
        Ok(staff) => Ok(staff),
        Err(e) => Err(format!("Failed to search staff: {}", e)),
    }
}

#[command]
pub fn get_staff_count() -> Result<StaffCount, String> {
    match get_staff_statistics() {
        Ok(count) => Ok(count),
        Err(e) => Err(format!("Failed to get staff count: {}", e)),
    }
}

#[command]
pub fn export_staff_to_pdf(staff_ids: Vec<i32>, template_type: String) -> Result<String, String> {
    // This is a placeholder for PDF export functionality
    // In a real implementation, you would generate PDF using a library like printpdf
    Ok(format!("PDF export requested for {} staff members using {} template",
              staff_ids.len(), template_type))
}