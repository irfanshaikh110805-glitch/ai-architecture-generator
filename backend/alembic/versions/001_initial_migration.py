"""Initial migration

Revision ID: 001
Revises: 
Create Date: 2026-03-19 10:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '001'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        'generated_architectures',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('idea', sa.Text(), nullable=False),
        sa.Column('result', sa.Text(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_generated_architectures_id'), 'generated_architectures', ['id'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_generated_architectures_id'), table_name='generated_architectures')
    op.drop_table('generated_architectures')
