using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Card_Service.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Template_Categories",
                columns: table => new
                {
                    Category_Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Category_Name = table.Column<string>(type: "nvarchar(60)", maxLength: 60, nullable: false),
                    Category_Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Created_at = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    Updated_at = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Template_Categories", x => x.Category_Id);
                });

            migrationBuilder.CreateTable(
                name: "Card_Templates",
                columns: table => new
                {
                    Template_Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Category_Id = table.Column<int>(type: "int", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Card_Template_Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    File_Path = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Is_premium = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    Created_at = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    Updated_at = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Card_Templates", x => x.Template_Id);
                    table.ForeignKey(
                        name: "FK_Card_Templates_Template_Categories_Category_Id",
                        column: x => x.Category_Id,
                        principalTable: "Template_Categories",
                        principalColumn: "Category_Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Card_Templates_Category_Id",
                table: "Card_Templates",
                column: "Category_Id");

            migrationBuilder.CreateIndex(
                name: "IX_Template_Categories_Category_Name",
                table: "Template_Categories",
                column: "Category_Name",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Card_Templates");

            migrationBuilder.DropTable(
                name: "Template_Categories");
        }
    }
}
