use std::fmt;

#[allow(dead_code)]
#[derive(Debug)]
pub enum NICError {
    InvalidFormat,
    InvalidYear,
    InvalidDay,
    InvalidLength,
}

impl fmt::Display for NICError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            NICError::InvalidFormat => write!(f, "Invalid NIC format"),
            NICError::InvalidYear => write!(f, "Invalid year in NIC"),
            NICError::InvalidDay => write!(f, "Invalid day in NIC"),
            NICError::InvalidLength => write!(f, "Invalid NIC length"),
        }
    }
}

/// Converts old format NIC to new format
/// Old format: YY DDD SSS C V/X (9 digits + letter)
/// New format: YYYY DDD SSSS C (12 digits)
#[allow(dead_code)]
pub fn convert_old_to_new_nic(old_nic: &str) -> Result<String, NICError> {
    // Remove any spaces and convert to uppercase
    let cleaned = old_nic.replace(" ", "").to_uppercase();

    // Check if it's already new format (12 digits)
    if cleaned.len() == 12 && cleaned.chars().all(|c| c.is_ascii_digit()) {
        return Ok(cleaned);
    }

    // Check old format: 9 digits + 1 letter (V/X)
    if cleaned.len() == 10 {
        let (digits, letter) = cleaned.split_at(9);

        if !digits.chars().all(|c| c.is_ascii_digit()) {
            return Err(NICError::InvalidFormat);
        }

        if letter != "V" && letter != "X" {
            return Err(NICError::InvalidFormat);
        }

        return convert_9_digits_to_12(digits);
    }

    // Check if it's just 9 digits without letter
    if cleaned.len() == 9 && cleaned.chars().all(|c| c.is_ascii_digit()) {
        return convert_9_digits_to_12(&cleaned);
    }

    Err(NICError::InvalidLength)
}

#[allow(dead_code)]
fn convert_9_digits_to_12(digits: &str) -> Result<String, NICError> {
    if digits.len() != 9 {
        return Err(NICError::InvalidLength);
    }

    // Parse the components: YY DDD SSS C
    let yy: u32 = digits[0..2].parse().map_err(|_| NICError::InvalidYear)?;
    let ddd: u32 = digits[2..5].parse().map_err(|_| NICError::InvalidDay)?;
    let sss: &str = &digits[5..8];
    let c: &str = &digits[8..9];

    // Validate day of year (1-366 for normal, 501-866 for female)
    if (ddd < 1 || ddd > 366) && (ddd < 501 || ddd > 866) {
        return Err(NICError::InvalidDay);
    }

    // Convert YY to YYYY
    let yyyy = if yy <= 50 {  // Assuming cutoff year 50 for 20xx vs 19xx
        2000 + yy
    } else {
        1900 + yy
    };

    // Format as 12-digit NIC: YYYY DDD 0SSS C
    Ok(format!("{}{:03}0{}{}", yyyy, ddd, sss, c))
}

/// Extracts information from NIC number (both old and new formats)
#[allow(dead_code)]
pub fn extract_nic_info(nic: &str) -> Result<NICInfo, NICError> {
    let new_nic = convert_old_to_new_nic(nic)?;

    if new_nic.len() != 12 {
        return Err(NICError::InvalidLength);
    }

    let year: u32 = new_nic[0..4].parse().map_err(|_| NICError::InvalidYear)?;
    let day_of_year: u32 = new_nic[4..7].parse().map_err(|_| NICError::InvalidDay)?;

    let (actual_day, is_female) = if day_of_year > 500 {
        (day_of_year - 500, true)
    } else {
        (day_of_year, false)
    };

    let gender = if is_female { "Female" } else { "Male" };

    Ok(NICInfo {
        year,
        day_of_year: actual_day,
        gender: gender.to_string(),
        new_format: new_nic,
    })
}

#[allow(dead_code)]
#[derive(Debug)]
pub struct NICInfo {
    pub year: u32,
    pub day_of_year: u32,
    pub gender: String,
    pub new_format: String,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_old_to_new_conversion() {
        // Example A: 741922757V -> 197419202757
        assert_eq!(convert_old_to_new_nic("741922757V").unwrap(), "197419202757");

        // Example B: 861234567V -> 198612304567
        assert_eq!(convert_old_to_new_nic("861234567V").unwrap(), "198612304567");

        // Example C (female): 916980123V -> 199169800123
        assert_eq!(convert_old_to_new_nic("916980123V").unwrap(), "199169800123");

        // Example D (year 2000): 001001234V -> 200010001234
        assert_eq!(convert_old_to_new_nic("001001234V").unwrap(), "200010001234");
    }

    #[test]
    fn test_new_format_passthrough() {
        let new_nic = "197419202757";
        assert_eq!(convert_old_to_new_nic(new_nic).unwrap(), new_nic);
    }

    #[test]
    fn test_extract_nic_info() {
        let info = extract_nic_info("741922757V").unwrap();
        assert_eq!(info.year, 1974);
        assert_eq!(info.day_of_year, 192);
        assert_eq!(info.gender, "Male");
        assert_eq!(info.new_format, "197419202757");

        let info_female = extract_nic_info("916980123V").unwrap();
        assert_eq!(info_female.gender, "Female");
        assert_eq!(info_female.day_of_year, 198); // 698 - 500
    }
}