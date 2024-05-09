import React from "react";
import { IconButton, Tooltip } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList'; // Icon for filtering
import { Link } from 'react-router-dom'; // Link component for routing

function FiltersIcon() {
    return (
        <div>
            {/* Tooltip for better user understanding */}
            <Tooltip title="Go to Advanced Filters">
                {/* Link wrapped IconButton for navigation */}
                <Link to="/advancedfilters" style={{ color: 'inherit', textDecoration: 'none' }}>
                    <IconButton color="primary" aria-label="go to advanced filters">
                        <FilterListIcon />
                    </IconButton>
                </Link>
            </Tooltip>
            {/* Additional content or components */}
        </div>
    );
}

export default FiltersIcon;
