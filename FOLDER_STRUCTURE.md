# Project Folder Structure

| Folder | Description |
|---|---|
| `data/raw/` | Original datasets before any cleaning, filtering, or modifications. |
| `data/processed/` | Cleaned and transformed datasets (CSV/JSON), ready for analysis and visualizations. |
| `data/processed-notebooks/` | Jupyter notebooks and Python scripts used for cleaning and processing datasets. Use descriptive filenames indicating the dataset and purpose, e.g., `prepare_bls_employment.ipynb`. |
| `js/` | JavaScript files responsible for rendering interactive visualizations on the website, loading data, and handling user interactions using D3.js. |
| `metadata/` | Metadata documentation for each dataset, including data sources, column descriptions, limitations, and research relevance. |
| `visualisations_codes/` | Development files and standalone VS Code projects used to build and test visualizations before integrating them into the main website. |

**Important:** Keep original datasets in `data/raw/` unchanged. Save processed outputs separately and retain the corresponding processing code for reproducibility.
