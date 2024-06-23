import React from "react";
import { IconButton, Tooltip } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList'; 
import { Link } from 'react-router-dom'; 

function FiltersIcon() {
    return (
        <div>
          
            <Tooltip title="Go to Advanced Filters">
            
                <Link to="/advancedfilters" style={{ color: 'inherit', textDecoration: 'none' }}>
                    <IconButton color="primary" aria-label="go to advanced filters">
                        <FilterListIcon />
                    </IconButton>
                </Link>
            </Tooltip>
          
        </div>
    );
}

export default FiltersIcon;
