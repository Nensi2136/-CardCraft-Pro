using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace User_Service.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "User_Details",
                columns: table => new
                {
                    User_Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Username = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Password_hash = table.Column<string>(type: "nvarchar(60)", maxLength: 60, nullable: false),
                    Is_premium = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    Is_admin = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    Created_at = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    Updated_at = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_User_Details", x => x.User_Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_User_Details_Email",
                table: "User_Details",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_User_Details_Password_hash",
                table: "User_Details",
                column: "Password_hash",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_User_Details_Username",
                table: "User_Details",
                column: "Username",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "User_Details");
        }
    }
}
