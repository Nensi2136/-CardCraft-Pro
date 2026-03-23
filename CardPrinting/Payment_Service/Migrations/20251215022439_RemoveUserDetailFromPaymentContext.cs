using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Payment_Service.Migrations
{
    /// <inheritdoc />
    public partial class RemoveUserDetailFromPaymentContext : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Payments_UserDetail_User_id",
                table: "Payments");

            migrationBuilder.DropTable(
                name: "UserDetail");

            migrationBuilder.DropIndex(
                name: "IX_Payments_User_id",
                table: "Payments");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "UserDetail",
                columns: table => new
                {
                    User_Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Created_at = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Is_admin = table.Column<bool>(type: "bit", nullable: false),
                    Is_premium = table.Column<bool>(type: "bit", nullable: false),
                    Password_hash = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Updated_at = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Username = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserDetail", x => x.User_Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Payments_User_id",
                table: "Payments",
                column: "User_id");

            migrationBuilder.AddForeignKey(
                name: "FK_Payments_UserDetail_User_id",
                table: "Payments",
                column: "User_id",
                principalTable: "UserDetail",
                principalColumn: "User_Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
