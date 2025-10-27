## PostgreSQL Setup (if not installed)

If you don't have **PostgreSQL 18** installed on your machine, follow these steps:

1. **Download PostgreSQL**
   Go to the official download page: [PostgreSQL Download](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads)

2. **Run the Installer**

   - Choose all **default options** during the installation.
   - Keep the **default port** (usually `5432`).
   - Use the **default installation location**.
   - Set a **password** for the `postgres` user (you'll need it later).
   - Optionally, install **pgAdmin** for a GUI.
   - When prompted, **skip Stack Builder** (not needed for this project).

3. **Verify the Installation**
   Open **Command Prompt / PowerShell** and run:

   ```bash
   psql --version
   ```

   You should see something like:

   ```
   psql (PostgreSQL) 18.x
   ```

4. **Next Steps**

   - Once verified, you can proceed with configuring your `.env` file and running Prisma migrations.
   - If `psql` is not recognized, make sure the PostgreSQL `bin` folder is added to your system PATH.
