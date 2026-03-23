using AutoMapper;
using User_Service.Models;
using User_Service.Models.DTOs;

namespace User_Service.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // User mappings
            CreateMap<UserDetail, UserDto>();
            CreateMap<CreateUserDto, UserDetail>()
                .ForMember(dest => dest.PasswordHash, opt => opt.Ignore()); // Password is handled separately
            CreateMap<UpdateUserDto, UserDetail>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
        }
    }
}
