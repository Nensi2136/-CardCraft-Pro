using AutoMapper;
using Card_Service.Models;
using Card_Service.Models.DTOs;

namespace Card_Service.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // CardTemplate mappings
            CreateMap<CardTemplate, CardTemplateDto>()
                .ForMember(dest => dest.CategoryName, 
                           opt => opt.MapFrom(src => src.Category.Name));
            
            CreateMap<CreateCardTemplateDto, CardTemplate>()
                .ForMember(dest => dest.Title, opt => opt.MapFrom(src => src.Name))
                .ForMember(dest => dest.FilePath, opt => opt.MapFrom(src => src.TemplateData));
            
            CreateMap<UpdateCardTemplateDto, CardTemplate>()
                .ForMember(dest => dest.Title, opt => opt.MapFrom(src => src.Name))
                .ForMember(dest => dest.FilePath, opt => opt.MapFrom(src => src.TemplateData))
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

            // Category mappings
            CreateMap<TemplateCategory, CategoryDto>();
            CreateMap<CreateCategoryDto, TemplateCategory>();
            CreateMap<UpdateCategoryDto, TemplateCategory>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
        }
    }
}
