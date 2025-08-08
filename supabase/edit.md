# Create a mapping of old to new names
$migrationMap = @{
    "20250610091336-eb2796bf-fe50-4594-b36b-8270532fa193.sql" = "20250610091336_initial_users.sql"
    "20250610091927-94b300c6-e078-43fe-b198-9b60c3a937cc.sql" = "20250610091927_user_profiles.sql"
    "20250610093316-f0d0ee44-348b-4483-8807-4bfe2c13c6d5.sql" = "20250610093316_tasks_table.sql"
    "20250610094536-c46430c7-a19a-47cb-b479-fa1d07b97ae0.sql" = "20250610094536_auth_policies.sql"
    "20250610094809-fbba4bfe-1417-4fdf-b8b7-dd4103d2cca6.sql" = "20250610094809_payment_tables.sql"
    "20250610095954-ee9bddb9-4473-45c7-95d9-cc783c16b8c3.sql" = "20250610095954_transactions.sql"
    "20250610100721-581f6fb2-4460-43c8-bda5-719777a2ba52.sql" = "20250610100721_admin_roles.sql"
    "20250610101222-57140668-3ed3-4a26-8572-8d1bbced122a.sql" = "20250610101222_audit_logs.sql"
    "20250610102258-35632706-c769-4e36-872a-c65c4bfc2ec5.sql" = "20250610102258_notifications.sql"
    "20250610104110-8315be74-6ba1-4061-8a22-189a4d7cb7a8.sql" = "20250610104110_settings.sql"
    "20250610104755-645cdcf6-1ed4-4cbe-9d66-f4735bc47eb8.sql" = "20250610104755_indexes.sql"
    "20250711082444-9f01eed6-c81a-4db0-ad94-b06b6432a425.sql" = "20250711082444_storage_setup.sql"
    "20250711082600-038acf6e-23c6-4267-ae24-c6587c648bb8.sql" = "20250711082600_final_adjustments.sql"
}

# Rename the files
foreach ($item in $migrationMap.GetEnumerator()) {
    if (Test-Path $item.Name) {
        Rename-Item -Path $item.Name -NewName $item.Value
        Write-Host "Renamed $($item.Name) to $($item.Value)"
    }
}