using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Review_Service.Migrations
{
    /// <inheritdoc />
    public partial class AddSubjectToContactUs : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Subject",
                table: "Contact_Us",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Subject",
                table: "Contact_Us");
        }
    }
}
