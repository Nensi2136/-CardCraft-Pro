using AutoMapper;
using Review_Service.DTOs;
using Review_Service.Models;

namespace Review_Service.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Review, ReviewDto>();
            CreateMap<CreateReviewDto, Review>();
            CreateMap<UpdateReviewDto, Review>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

            CreateMap<ContactUs, ContactUsDto>();
            CreateMap<CreateContactUsDto, ContactUs>();
            CreateMap<UpdateContactUsDto, ContactUs>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
        }
    }
}
