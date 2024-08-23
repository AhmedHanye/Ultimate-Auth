from django.db.models.signals import post_migrate
from django.dispatch import receiver
from django.contrib.sites.models import Site
from django.conf import settings


@receiver(post_migrate)
def create_site(sender, **kwargs):
    domain = settings.FRONT_END.split("//")[-1]
    name = settings.SITE_NAME
    if Site.objects.filter(id=1).exists():
        site = Site.objects.get(id=1)
        site.domain = domain
        site.name = name
        site.save()
    else:
        Site.objects.create(id=1, domain=domain, name=name)
