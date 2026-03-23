using Card_Service.Controllers;
using Card_Service.Services.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace CardPrinting.Tests.Controllers
{
    public class CardTemplatesControllerTests
    {
        private readonly Mock<ICardTemplateService> _mockTemplateService;
        private readonly Mock<IMapper> _mockMapper;
        private readonly Mock<IWebHostEnvironment> _mockEnvironment;
        private readonly Mock<IConfiguration> _mockConfiguration;
        private readonly Mock<ILogger<CardTemplatesController>> _mockLogger;
        private readonly CardTemplatesController _controller;

        public CardTemplatesControllerTests()
        {
            _mockTemplateService = new Mock<ICardTemplateService>();
            _mockMapper = new Mock<IMapper>();
            _mockEnvironment = new Mock<IWebHostEnvironment>();
            _mockConfiguration = new Mock<IConfiguration>();
            _mockLogger = new Mock<ILogger<CardTemplatesController>>();

            _controller = new CardTemplatesController(
                _mockTemplateService.Object,
                _mockMapper.Object,
                _mockEnvironment.Object,
                _mockConfiguration.Object,
                _mockLogger.Object);
        }

        [Fact]
        public async Task GetTemplates_ReturnsOkResult_WithTemplates()
        {
            // Arrange
            var templates = new List<CardTemplateDto>();
            _mockTemplateService.Setup(s => s.GetAllTemplatesAsync())
                .ReturnsAsync(templates);

            // Act
            var result = await _controller.GetTemplates();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Equal(templates, okResult.Value);
        }

        [Fact]
        public async Task GetTemplate_WithValidId_ReturnsOkResult()
        {
            // Arrange
            var templateId = 1;
            var template = new CardTemplateDto { Template_Id = templateId };
            _mockTemplateService.Setup(s => s.GetTemplateByIdAsync(templateId))
                .ReturnsAsync(template);

            // Act
            var result = await _controller.GetTemplate(templateId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Equal(template, okResult.Value);
        }

        [Fact]
        public async Task GetTemplate_WithInvalidId_ReturnsNotFound()
        {
            // Arrange
            var templateId = 999;
            _mockTemplateService.Setup(s => s.GetTemplateByIdAsync(templateId))
                .ReturnsAsync((CardTemplateDto?)null);

            // Act
            var result = await _controller.GetTemplate(templateId);

            // Assert
            Assert.IsType<NotFoundResult>(result.Result);
        }
    }
}
