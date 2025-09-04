// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod database;
mod commands;
mod utils;

use database::operations::initialize_database;
use commands::staff::{
    add_staff, get_all_staff, get_staff_by_id, update_staff, delete_staff,
    search_staff, get_staff_count, export_staff_to_pdf
};

fn main() {
    tauri::Builder::default()
        .setup(|_app| {
            // Initialize database on startup
            match initialize_database() {
                Ok(_) => println!("Database initialized successfully"),
                Err(e) => {
                    eprintln!("Failed to initialize database: {}", e);
                    std::process::exit(1);
                }
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            add_staff,
            get_all_staff,
            get_staff_by_id,
            update_staff,
            delete_staff,
            search_staff,
            get_staff_count,
            export_staff_to_pdf
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}